import Vue from "vue"
import App from "./App.vue"
import vuetify from "./plugins/vuetify"
import router from './plugins/vue-router'
import "material-design-icons-iconfont/dist/material-design-icons.css"
import './assets/main.css'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount("#app")
