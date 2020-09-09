import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import permission from '@/directive/permission/index.js'
// 核心插件
import kmChannel from './plugin/kmChannel'

// 核心插件
Vue.use(kmChannel)
Vue.use(permission)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
