import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 核心插件
import kmChannel from './plugin/kmChannel'
import * as filters from './filters'
let filtersAll = filters
Object.keys(filtersAll).forEach((key) => {
  Vue.filter(key, filtersAll[key])
})
Vue.config.productionTip = false
// 核心插件
Vue.use(kmChannel)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
