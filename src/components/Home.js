export default {
  name: "Home",
  data() {
    return {
      audioCTX: null,
    }
  },
  mounted() {
    // Fetch context
    const AudioContext = window.AudioContext || window.webkitAudioContext
    this.audioCTX = new AudioContext()
  },
  methods: {
    uploadAudio() {
      console.log(setupSample)
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
