import Vue from 'vue'
// import VueResource from 'vue-resource'
import App from './App'
import router from './router/index.js'
import axios from 'axios'

import './common/stylus/index.styl'

// Vue.use(VueResource)
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
