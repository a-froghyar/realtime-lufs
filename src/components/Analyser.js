import Tone from "tone"
import LUFSWorker from "../workers/lufs.worker"

let FFT_SIZE = 2048
let counter = 0
let text

export default {
  props: ["audioURL"],
  data() {
    return {
      runAnalysis: false,
      buttonLabel: "Start Analysis",
      initiated: false,
      audioCTX: null,
      sourceNode: null,
    }
  },
  methods: {
    toggleAnalysis() {
      this.runAnalysis = !this.runAnalysis
      this.startAnalysis()
    },
    initContext() {
      // Fetch and sync context with Tone
      const AudioContext = window.AudioContext || window.webkitAudioContext
      this.audioCTX = new AudioContext()
      Tone.setContext(this.audioCTX)

      // Create source node
      const playerElement = document.getElementById("audioPlayer")
      this.sourceNode = this.audioCTX.createMediaElementSource(playerElement)

      this.initiated = true
    },
    startAnalysis() {
      if (!this.audioURL) {
        alert("You need to upload an audio file first!")
        return
      }

      if (!this.runAnalysis) {
        return
      }

      if (!this.initiated) {
        this.initContext()
      }
      // FFT Container Values
      const FFTContainer = document.getElementById("FFT")
      FFTContainer.width = 1500
      FFTContainer.height = 500
      FFTContainer.style.width = "750px" // for better quality rendering
      FFTContainer.style.height = "250px"
      const xAxisLogBins = []
      const FFTCtx = FFTContainer.getContext("2d")
      const FFTCtxHeight = FFTCtx.canvas.height
      const FFTCtxWidth = FFTCtx.canvas.width
      const xTicks = [30, 50, 100, 200, 1000, 2000, 4000, 10000]

      // Canvas Values
      // [px] - padding for the xAxis ticks
      const FFTpaddingBottom = 50
      // scale up values for quicker movement
      const FFTscaler = 4
      FFTCtx.font = "30px Avenir"
      FFTCtx.fillStyle = "black"
      FFTCtx.textAlign = "center"
      FFTCtx.strokeStyle = "black"

      // Linear Scale X-axis array
      const xArray = Array.from({length: FFT_SIZE}, (v, i) => i)

      // Log positions of X-Ticks
      for (let bin = 0; bin < FFT_SIZE; bin++) {
        xAxisLogBins.push(
          getXAxisLogScale(FFT_SIZE, FFTCtxWidth, xArray[bin], null)
        )
      }

      // Log Scale X-Axis(Frequency)
      for (let freq = 0; freq < xTicks.length; freq++) {
        FFTCtx.fillText(
          String(xTicks[freq]),
          getXAxisLogScale(FFT_SIZE, FFTCtxWidth, null, xTicks[freq]),
          FFTCtxHeight
        )
      }

      /* Init LUFS
        - Loudness measurement according to the EBU R 128 standard
        - Algorithm according to ITU BS.1770 standard
        - Recommendation: https://tech.ebu.ch/docs/r/r128.pdf
        - Algorithm: https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1770-4-201510-I!!PDF-E.pdf
        - More info: https://en.wikipedia.org/wiki/LKFS
      */

      // create the two stage filter process and init meter to fetch values
      const waveFormNode = new Tone.Waveform(FFT_SIZE)
      const meter = new Tone.Waveform(FFT_SIZE)

      const highShelfBvalues = [
        1.53512485958697,
        -2.69169618940638,
        1.19839281085285,
      ]
      const highShelfAValues = [1, -1.69065929318241, 0.73248077421585]
      const highShelfFilter = this.audioCTX.createIIRFilter(
        highShelfBvalues,
        highShelfAValues
      )

      const highPassBvalues = [1.0, -2.0, 1.0]
      const highPassAValues = [1.0, -1.99004745483398, 0.99007225036621]
      const highPassFilter = this.audioCTX.createIIRFilter(
        highPassBvalues,
        highPassAValues
      )

      // Create FFT
      const FFT = new Tone.FFT(FFT_SIZE)

      // Connect the graph
      Tone.connect(this.sourceNode, FFT)
      Tone.connect(FFT, waveFormNode)
      Tone.connect(waveFormNode, highShelfFilter)
      Tone.connect(highShelfFilter, highPassFilter)
      Tone.connect(highPassFilter, meter)

      // Send source to master to hear audio
      FFT.toMaster()

      // Define LUFS worker
      const lufsWorker = new LUFSWorker()

      // Schedule Loop
      const scheduleAnalyser = () => {
        if (!this.runAnalysis) {
          return
        }
        requestAnimationFrame(scheduleAnalyser)

        // Clear the canvas
        FFTCtx.clearRect(0, 0, FFTCtxWidth, FFTCtxHeight - FFTpaddingBottom)

        // Fetch and draw FFT
        const frequencyBinsValue = FFT.getValue()
        frequencyBinsValue.forEach((bin, i) => {
          FFTCtx.beginPath()
          FFTCtx.moveTo(xAxisLogBins[i], FFTCtxHeight - FFTpaddingBottom)
          FFTCtx.lineTo(
            xAxisLogBins[i],
            Math.min(0 - FFTscaler * bin, FFTCtxHeight - FFTpaddingBottom)
          )
          FFTCtx.stroke()
        })

        // RMS

        const waveFormValue = waveFormNode.getValue()

        // Compute average power over the interval
        let sumOfSquares = 0
        for (let i = 0; i < waveFormValue.length; i++) {
          sumOfSquares += waveFormValue[i] ** 2
        }
        // Normalised RMS - this value is normalised to a 997 Hz Sine Wave at 0dbFS
        // More info: https://en.wikipedia.org/wiki/DBFS
        const normalisationFactor = 3.01
        const RMSPowerDecibels =
          20 * Math.log10(Math.sqrt(sumOfSquares / waveFormValue.length)) +
          normalisationFactor
        displayNumber("RMS", RMSPowerDecibels, counter)

        // LUFS
        const filteredSignal = meter.getValue()

        // Init the worker
        if (counter === 0) {
          lufsWorker.postMessage({
            messageType: "init",
            FFT_SIZE: FFT_SIZE,
            counter: counter,
            FS: this.audioCTX.sampleRate,
          })
        }

        // Fill up the analysis buffer
        if (counter !== 0) {
          lufsWorker.postMessage({
            messageType: "fillBuffer",
            filteredSignal: filteredSignal,
            counter: counter,
          })
        }

        // Receive back calculation from worker
        lufsWorker.onmessage = (e) => {
          if (e.data.returnMessageType === "integratedCalculated") {
            const integratedLoudness = e.data.integratedLoudness
            displayNumber("LUFSIntegrated", integratedLoudness)
          }
          if (e.data.returnMessageType === "shortTermCalculated") {
            const shortTermLoudness = e.data.shortTermLoudness
            displayNumber("LUFSShort", shortTermLoudness, counter)
          }
        }
        counter++
      }
      scheduleAnalyser()
    },
  },
}

// Convert linear scale to log scale for the canvas
function getXAxisLogScale(FFT_SIZE, canvasWidth, bin, freq) {
  const minLog = Math.log10(20)
  const maxLog = Math.log10(22050)

  // Current frequency corresponding to bin, or passing freq for ticks
  if (!freq) {
    freq = (bin * 22050) / FFT_SIZE
  }

  // Bandwidth of the canvas for the frequency range
  const bandWidth = canvasWidth / (maxLog - minLog)

  // Rounding to avoid decimal pixel values
  return Math.round(bandWidth * (Math.log10(freq) - minLog))
}

function displayNumber(id, value, counter) {
  const meter = document.getElementById(id + "-level")
  if (counter) {
    // Slow down the display of numerical values:
    // Set a threshold for refreshing the display of the numerical
    // value based on the counter (counting per refresh rate) and
    // the arbitrary value of 50 defined below
    if (counter % 50 === 0) {
      text = document.getElementById(id + "-level-text")
      text.textContent = value.toFixed(2)
    }
    meter.value = isFinite(value) ? value : meter.min
  } else {
    text = document.getElementById(id + "-level-text")
    text.textContent = value.toFixed(2)
    meter.value = isFinite(value) ? value : meter.min
  }
}
