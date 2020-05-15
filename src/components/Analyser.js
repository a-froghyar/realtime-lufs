import Tone from "tone"
let FFT_SIZE = 2048

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

      const FFTContainer = document.getElementById("FFT")
      FFTContainer.width = 1500
      FFTContainer.height = 500
      FFTContainer.style.width = "750px"
      FFTContainer.style.height = "250px"

      // FFT Container Values
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
      // [px] - shift values up the canvas for better visibility
      const FFTyAxisShift = 0
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
      const meter = new Tone.Meter(FFT_SIZE)

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
            Math.min(
              0 - FFTscaler * bin - FFTyAxisShift,
              FFTCtxHeight - FFTpaddingBottom
            )
          )
          FFTCtx.stroke()
        })
      }

      scheduleAnalyser()
    },
  },
}

// Convert linear scale to log scale for the canvas
function getXAxisLogScale(FFT_SIZE, canvasWidth, bin, freq) {
  /**
   * TODO: maxLog needs be programmed for  sampleRate/2, however
   * webaudio's analysernode outputs values between 0 and 22050 Hz.
   * Need to deal with aliasing coming from the 24 kHz context.
   */
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
