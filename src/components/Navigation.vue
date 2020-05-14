<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="mini"
    permanent
    fixed
    :disable-resize-watcher="true"
    :disable-route-watcher="true"
  >
    <v-list>
      <v-list-item v-for="item in items" :key="item.title" link :ripple="false">
        <v-list-item-icon>
          <v-btn
            icon
            rounded
            color="primary"
            id="no-background-hover"
            :to="item.to"
            class="menu-button"
          >
            <v-icon large>{{ item.icon }}</v-icon>
          </v-btn>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      items: [
        {title: "Home", icon: "fiber_manual_record", to: "/"},
        {title: "About", icon: "stop", to: "/about"}
      ],
      mini: true
    }
  }
}
</script>


<style scoped>
.menu-button {
  right: 9px;
}

#no-background-hover::before {
  background-color: transparent !important;
}
</style>