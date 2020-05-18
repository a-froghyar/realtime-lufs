<template>
  <v-container fluid>

    <v-row>
      <v-btn @click="toggleAnalysis">
        <span v-if="runAnalysis">Stop Analysis</span>
        <span v-else>Start Analysis</span>
      </v-btn>
    </v-row>

    <v-container fluid>
      <v-flex lg12 md12 sm3 xs3>
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
                  <meter
                    id="LUFSIntegrated-level"
                    min="-100"
                    max="10"
                    value="-100"
                    class="rms-meter"
                  ></meter>
                </v-row>
              </v-container>
            </v-row>
          </v-flex>
        </v-row>
      </v-flex>
    </v-container>

    <v-row align-start>
      <div class="hidden-sm-and-down FFT-container">
        <canvas class="FFT-canvas" id="FFT"></canvas>
      </div>
    </v-row>
  </v-container>
</template>

<script src="./Analyser.js"></script>