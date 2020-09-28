import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {permissonCheckMenus} from './utils/'
// 核心插件
import kmChannel from './plugin/kmChannel'
// 全局添加菜单权限
Vue.prototype.permissonCheckMenus = permissonCheckMenus
Vue.config.productionTip = false
// 核心插件
Vue.use(kmChannel)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
