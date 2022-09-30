import Vue from 'vue'
import axios from 'axios'
import { date } from 'quasar'
import { stringify } from 'qs'
import VueHotkey from 'v-hotkey'
Vue.use(VueHotkey)

axios.interceptors.request.use(
  (config) => {
    if (config.method === 'post') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.data = stringify(config.data)
    }
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

Vue.prototype.$axios = axios
Vue.prototype.$date = date
