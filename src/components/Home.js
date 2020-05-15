import Analyser from "./Analyser.vue"
import Tone from "tone"

export default {
  name: "Home",
  components: {Analyser},
  data() {
    return {
      audioURL: null,
      sourceNode: null,
      audioCTX: null,
    }
  },
  mounted() {
    // Fetch Context
    const AudioContext = window.AudioContext || window.webkitAudioContext
    this.audioCTX = new AudioContext()
    Tone.setContext(this.audioCTX)
  },
  methods: {
    uploadAudio(file) {
      this.audioURL = URL.createObjectURL(file)
      this.$refs.audioPlayer.load()
      this.audioCTX.resume().then(() => {
        console.log("Audio Context Initialised!")
      })
      this.createSourceNode()
    },
    createSourceNode() {
      const playerElement = document.getElementById("audioPlayer")
      this.sourceNode = this.audioCTX.createMediaElementSource(playerElement)
      // Connect to master
      this.sourceNode.connect(this.audioCTX.destination)
    },
  },
}
