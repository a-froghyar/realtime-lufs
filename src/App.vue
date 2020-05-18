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
}
</script>