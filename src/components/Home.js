import Analyser from "./Analyser.vue"

export default {
  name: "Home",
  components: {Analyser},
  data() {
    return {
      audioURL: null,
    }
  },
  methods: {
    uploadAudio(file) {
      this.audioURL = URL.createObjectURL(file)
      this.loadIntoPlayer()
    },
    loadIntoPlayer() {
      this.$refs.audioPlayer.load()
    },
  },
}

async function getFile(audioContext, filepath) {
  const response = await fetch(filepath)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
  return audioBuffer
}

async function setupSample() {
  const filePath = "dtmf.mp3"
  const sample = await getFile(this.audioCtx, filePath)
  return sample
}
