<template>
  <v-container>
    <v-row>
      <v-btn @click="toggleAnalysis">
        <span v-if="runAnalysis">Stop Analysis</span>
        <span v-else>Start Analysis</span>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script src="./Analyser.js"></script>