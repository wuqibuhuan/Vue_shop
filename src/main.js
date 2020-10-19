import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式
import './assets/css/globol.css'
// 导入字体图标
import './assets/font/iconfont.css'
import Axios from 'axios'

Axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$http = Axios


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')