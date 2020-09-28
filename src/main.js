import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 核心插件
import kmChannel from './plugin/kmChannel'
Vue.config.productionTip = false
// 核心插件
Vue.use(kmChannel)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
