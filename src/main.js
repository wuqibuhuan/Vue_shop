import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式
import './assets/css/globol.css'
// 导入字体图标
import './assets/font/iconfont.css'
import '../fonts/iconfont.css'
import axios from 'axios'

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

// 请求头拦截
axios.interceptors.request.use(config => {
  // NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// axios.interceptors.response.use(config => {
//   NProgress.done()
//   return config
// })

Vue.prototype.$http = axios



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')