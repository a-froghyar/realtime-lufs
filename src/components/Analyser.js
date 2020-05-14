import Tone from "tone"

export default {
  props: ["audioURL"],
  data() {
    return {
      runAnalysis: false,
      buttonLabel: "Start Analysis",
    }
  },
  methods: {
    toggleAnalysis() {
      this.runAnalysis = !this.runAnalysis
      this.startAnalysis()
    },
    startAnalysis() {
      if (!this.audioURL) {
        alert("You need to upload an audio file first!")
        return
      }

      if (!this.runAnalysis) {
        return
      }

      const AudioContext = window.AudioContext || window.webkitAudioContext
      const audioCTX = new AudioContext()

      Tone.setContext(audioCTX)

      // Fetch context
      //   const audioCTX = Tone.context._context
      console.log(audioCTX)

      // Create source node
      const playerElement = document.getElementById("audioPlayer")
      const sourceNode = audioCTX.createMediaElementSource(playerElement)

      // meter
      const meter = new Tone.Waveform(2048 * 4)

      Tone.connect(sourceNode, meter)
      meter.toMaster()

      // Schedule Loop

      const scheduleAnalyser = () => {
        if (!this.runAnalysis) {
          return
        }
        requestAnimationFrame(scheduleAnalyser)

        console.log(meter.getValue())
      }

      scheduleAnalyser()
    },
  },
}
