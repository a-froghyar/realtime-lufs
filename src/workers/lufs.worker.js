/**
 * LUFS Calculation according to ITU-R BS.1770-4
 */

//  Init global variables
let realTimeBuffer
let FFT_SIZE
let step
let gatingBlockIntervalSamples
let numberOfGatingBlocks
let analysisIntervalCounter
let absoluteThreshold

onmessage = e => {
  if (e.data.messageType === 'init') {
    // Init method called once only on the first counter
    init(e)
  }
  if (e.data.messageType === 'fillBuffer') {
    // These methods are repeatedly called, real-time calculation
    longTermLoudness(e)
    shortTermLoudness(e)
  }
}

/**
 * Initialises the parameters needed for the short term and
 * integrated calculations
 * @param {Object} e event data posted to the worker
 */
function init (e) {
  // Init local variables
  const FS = e.data.FS
  const overlap = 0.75 // [%]
  const analysisInterval = 1000 // [Ms], analysis interval set to one seconds accordig to literature
  const gatingBlockInterval = 400 // [Ms]
  const analysisIntervalSamples = Math.round((FS * analysisInterval) / 1000)

  // Init global variables
  step = 1 - overlap
  FFT_SIZE = e.data.FFT_SIZE
  gatingBlockIntervalSamples = Math.round((FS * gatingBlockInterval) / 1000)
  numberOfGatingBlocks = Math.floor((analysisIntervalSamples - gatingBlockIntervalSamples) / (gatingBlockIntervalSamples * step)) + 1
  absoluteThreshold = -70 // LUFS

  // Create real time buffer array - collecting one second of samples
  const realTimeBufferLength = Math.ceil(FS / gatingBlockIntervalSamples) * gatingBlockIntervalSamples

  // Init real-time buffer
  realTimeBuffer = new Float32Array(realTimeBufferLength)
  analysisIntervalCounter = Math.floor(realTimeBufferLength / FFT_SIZE) // analysis interval in counter value
}

function longTermLoudness (e) {
  // Init local variables
  const counter = e.data.counter
  // Fill up buffer first then return calculation
  const filledrealTimeBuffer = fillBuffer(e)
  if (!(counter % analysisIntervalCounter === 0)) {
    return
  }

  // Clone the filled ring buffer for processing
  const filledrealTimeBufferClone = filledrealTimeBuffer

  // Fetch all 400 Ms gating blocks
  const allGatingBlocks = sliceBuffer(filledrealTimeBufferClone, numberOfGatingBlocks, gatingBlockIntervalSamples)

  // Filter out blocks below absolute threshold
  const blocksAboveAbsoluteThreshold = filterOutBelowThreshold(allGatingBlocks, absoluteThreshold)

  // Create relative threshold - need to average over all blocks
  const sumAboveAbsoluteThreshold = meanSquareLoudness(blocksAboveAbsoluteThreshold, true)
  const relativeThreshold = sumAboveAbsoluteThreshold - 10 // [LUFS]

  // Filter out blocks below relative threshold
  const blocksAboveBothThreshold = filterOutBelowThreshold(blocksAboveAbsoluteThreshold, relativeThreshold)

  // Get loudness of blocks
  const integratedLoudness = meanSquareLoudness(blocksAboveBothThreshold, true)
  // Send back loudness to main thread
  postMessage({
    returnMessageType: 'integratedCalculated',
    integratedLoudness
  })
}

/**
 * Calculates the short term loudness of the signal in LUFS
 * @param {Object} e event data posted to the worker
 */
function shortTermLoudness (e) {
  const filteredSignal = e.data.filteredSignal
  const shortTermLoudness = meanSquareLoudness(filteredSignal)
  postMessage({
    returnMessageType: 'shortTermCalculated',
    shortTermLoudness
  })
}

/*
  Utility functions
*/

/**
 * Fills up the ringBuffer Array needed for the long term integrated
 * loudness calculation
 * @param {Object} e event data posted to the worker
 */
function fillBuffer (e) {
  const counter = e.data.counter
  const filteredSignal = e.data.filteredSignal
  const blockCounter = (counter % analysisIntervalCounter) * FFT_SIZE

  for (let sample = 0; sample < filteredSignal.length; sample++) {
    // fill up block buffer for analysis window
    realTimeBuffer[sample + blockCounter] = filteredSignal[sample]
  }
  if (counter % analysisIntervalCounter === 0) {
    return realTimeBuffer
  }
}

/**
 * Slice the ring (real time) buffer into 400 Ms blocks with 75% overlap -
 * collects all blocks for the current ring buffer.
 * @param {Array} filledrealTimeBufferClone
 * @param {Number} numberOfGatingBlocks
 * @param {Number} gatingBlockIntervalSamples
 * @returns {Array} allGatingBlocks
 */
function sliceBuffer (filledrealTimeBufferClone, numberOfGatingBlocks, gatingBlockIntervalSamples) {
  const allGatingBlocks = []
  for (let block = 0; block < numberOfGatingBlocks; block++) {
    const gatingBlockStepSize = block * (gatingBlockIntervalSamples * step)
    const currentGatingBlock = new Array(
      filledrealTimeBufferClone.slice(
        gatingBlockStepSize,
        gatingBlockIntervalSamples + gatingBlockStepSize
      )
    )
    allGatingBlocks[block] = currentGatingBlock[0]
  }
  return allGatingBlocks
}

/**
 * Filters out the values below the threshold in the input array
 * @param {Array} blocksArray
 * @param {Number} threshold
 * @returns {Array} blocksArray
 */
function filterOutBelowThreshold (blocksArray, threshold) {
  blocksArray.filter(block => {
    return meanSquareLoudness(block) > threshold
  })
  return blocksArray
}

/**
 * Finds the mean square loudness in LUFS according to ITU-R BS.1770-4
 *
 * The second input to this function accounts for averaging over
 * the 400 Ms analysis block defined in the norm.
 * @param {Array} signal
 * @param {Number} numberOfBlocks
 */
function meanSquareLoudness (signal, averageOverBlocks = false) {
  if (!averageOverBlocks) {
    let sum = 0
    for (let i = 0; i < signal.length; i++) {
      sum += signal[i] ** 2
    }
    return -0.691 + 10 * Math.log10(sum / signal.length)
  } else {
    let blocksSum = 0
    const numberOfBlocks = Object.keys(signal).length
    for (let j = 0; j < numberOfBlocks; j++) {
      let sum = 0
      for (let i = 0; i < signal[0].length; i++) {
        sum += signal[j][i] ** 2
      }
      blocksSum += sum / signal[j].length
    }
    return -0.691 + 10 * Math.log10(blocksSum / numberOfBlocks)
  }
}
