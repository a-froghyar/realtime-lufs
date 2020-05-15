<template>
  <v-container>
    <v-row>
      <v-btn @click="toggleAnalysis">
        <span v-if="runAnalysis">Stop Analysis</span>
        <span v-else>Start Analysis</span>
      </v-btn>
    </v-row>

    <v-row align-start>
      <div class="FFT-container">
        <canvas class="FFT-canvas" id="FFT"></canvas>
      </div>
    </v-row>
  </v-container>
</template>

<script src="./Analyser.js"></script>

<style scoped>
.FFT-container {
  width: 100%;
  height: 100%;
}

.FFT-canvas {
  margin-right: 300px;
}
</style>