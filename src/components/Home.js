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
      if (!this.sourceNode) {
        this.audioCTX.resume().then(() => {
          console.log("Audio Context Initialised!")
        })
        this.createSourceNode()
      } else {
        this.connectSourceNode()
      }
    },
    createSourceNode() {
      const playerElement = document.getElementById("audioPlayer")
      this.sourceNode = this.audioCTX.createMediaElementSource(playerElement)
      this.connectSourceNode()
    },
    connectSourceNode() {
      // Connect to master
      this.sourceNode.connect(this.audioCTX.destination)
    },
    accessAudio() {
      navigator.mediaDevices.getUserMedia({audio: true, video: false})
      .then((stream) => {
        this.sourceNode = this.audioCTX.createMediaStreamSource(stream)
        this.connectSourceNode()
      })
    }
  },
}
