<template>
  <v-container fluid class="main-container">
    <v-flex lg12 md12 sm8 xs6>
      <v-col cols="12" :md="12">
        <v-row class="title-text">
          <h1 class="display-4">Real Time LUFS Loudness Meter</h1>
        </v-row>
        <v-row>
          <h1 class="subtitle-text title">
            Based on the
            <a
              color="black"
              href="https://www.itu.int/dms_pubrec/itu-r/rec/bs/R-REC-BS.1770-4-201510-I!!PDF-E.pdf"
            >BS.1770-4</a> recommendation from the International Telecommunication Union.
          </h1>
        </v-row>
        <v-flex lg12 md12 sm6 xs12>
          <v-row class="upload-area">
            <v-flex md-6 class="decrease-flex">
              <v-container>
                <v-row align-start>
                  <v-btn tag="label">
                    <input
                      type="file"
                      class="upload-audio"
                      accept="audio/mp3, audio/wav"
                      @change="uploadAudio($event.target.files[0])"
                    />
                    Upload Audio
                    <span>&#42;</span>
                  </v-btn>
                </v-row>
              </v-container>
            </v-flex>
            <v-flex md-6 class="audio-player-container">
              <v-row justify-start>
                <audio class="audio-player" id="audioPlayer" ref="audioPlayer" controls>
                  <source :src="audioURL" />
                </audio>
              </v-row>
            </v-flex>
          </v-row>
        </v-flex>

        <v-row>
          <h1 class="asterisk-text body-2">
            <span>&#42;</span>: the file will never leave your computer
          </h1>
        </v-row>
          <v-row class="mt-2">
            <v-flex md-6 class="decrease-flex">
              <v-container>
                <v-row align-start>
                  <v-btn 
                  tag="label"
                  @click="accessAudio">
                    Access Computer Audio
                  </v-btn>
                </v-row>
              </v-container>
            </v-flex>
          </v-row>
        <v-row class="mt-1"></v-row>
      </v-col>
    </v-flex>
    <v-divider class="divider"></v-divider>
    <v-row>
      <v-container fluid>
        <Analyser :sourceNode="sourceNode" :audioURL="audioURL"></Analyser>
      </v-container>
    </v-row>
  </v-container>
</template>

<script src="./Home.js"></script>
