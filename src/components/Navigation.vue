<template>
  <v-app-bar app class="nav-bar" color="primary" dark>
    <div class="nav-elements align-center">
      <div>
        <v-btn icon to="/" rounded class="menu-button" id="no-background-hover">
          <v-icon color="black" large>fiber_manual_record</v-icon>
        </v-btn>
      </div>
      <v-btn icon to="/about" class="menu-button" id="no-background-hover">
        <v-icon color="black" x-large>stop</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>


<style scoped>
.nav-elements {
  padding-top: 60px;
}
.nav-bar {
  width: 70px;
  height: -webkit-fill-available !important;
}

.menu-button {
  right: 9px;
}

#no-background-hover::before {
  background-color: transparent !important;
}
</style>