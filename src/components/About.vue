<template>
  <v-container fluid class="main-container">
    <v-col cols="12" :md="12">
      <v-row class="title-text">
        <h1 class="display-4">About</h1>
      </v-row>
    </v-col>
    <v-divider class="mt-4 divider"></v-divider>

    <v-container>
      <v-row>
        <v-flex md-6>
          <v-container>
            <v-row>
              <a href="https://github.com/a-froghyar/frghr-lufs" target="_blank">
                <img class="logo" src=".././assets/github.png" />
              </a>
            </v-row>
          </v-container>
        </v-flex>
        <v-flex md-6>
          <v-container>
            <v-row>
              <a href="https://www.linkedin.com/in/adam-froghyar/" target="_blank">
                <img class="logo" src=".././assets/linkedin.png" />
              </a>
            </v-row>
          </v-container>
        </v-flex>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "About" 
}
</script>
