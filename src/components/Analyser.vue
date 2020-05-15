<template>
  <v-container>
    <v-row>
      <v-btn @click="toggleAnalysis">
        <span v-if="runAnalysis">Stop Analysis</span>
        <span v-else>Start Analysis</span>
      </v-btn>
    </v-row>

    <v-container>
      <v-row class="pt-1">
        <v-flex md-4>
          <v-row align-start>
            <v-container>
              <v-row>
                <div class="rms-meter-container">
                  RMS
                  <span id="RMS-level-text" class="meter-text">—</span> dBFS
                </div>
              </v-row>
              <v-row class="pt-2">
                <meter id="RMS-level" min="-100" max="10" value="-100" class="rms-meter"></meter>
              </v-row>
            </v-container>
          </v-row>
        </v-flex>

        <v-flex md-4>
          <v-row align-start>
            <v-container>
              <v-row>
                <div class="lufsshort-meter-container">
                  Loudness
                  <span id="LUFSShort-level-text" class="meter-text">—</span> LUFS
                </div>
              </v-row>
              <v-row class="pt-2">
                <meter id="LUFSShort-level" min="-100" max="10" value="-100" class="rms-meter"></meter>
              </v-row>
            </v-container>
          </v-row>
        </v-flex>

        <v-flex md-4>
          <v-row align-start>
            <v-container>
              <v-row>
                <div class="lufsintegrated-meter-container">
                  Integrated
                  <span id="LUFSIntegrated-level-text" class="meter-text">—</span> LUFS
                </div>
              </v-row>
              <v-row class="pt-2">
                <meter id="LUFSIntegrated-level" min="-100" max="10" value="-100" class="rms-meter"></meter>
              </v-row>
            </v-container>
          </v-row>
        </v-flex>
      </v-row>
    </v-container>

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

.rms-meter-container {
  z-index: 99;
  color: black;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  border-radius: 50px;
}

.lufsshort-meter-container {
  z-index: 99;
  color: black;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  border-radius: 50px;
}

.lufsintegrated-meter-container {
  z-index: 99;
  color: black;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  border-radius: 50px;
}

.rms-meter {
  /* transform: rotate(270deg) scale(3); */
  width: 150px;
  /* margin-left: 45px; */
}

meter::-webkit-meter-optimum-value {
  box-shadow: 0 5px 5px -5px #999 inset;
  background-image: linear-gradient(
    90deg,
    #5d6675 5%,
    #556072 5%,
    #4d5666f6 15%,
    #4b5464 15%,
    #363f4d 55%,
    #2e3847 55%,
    #242d3b 95%,
    #242d3b 95%,
    #242d3b 100%
  );
  background-size: 100% 100%;
}
</style>