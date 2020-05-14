<template>
  <v-app>
    <router-view />
    <Navigation></Navigation>
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation"

export default {
  name: "App",
  components: {
    Navigation: Navigation
  },

  data: () => ({
    //
  })
}
</script>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
