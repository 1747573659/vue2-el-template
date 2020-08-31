import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@/assets/styleForUI/index.scss'
import '@/assets/styleForUI.scss'
import TreeCustom from '@/components/treeCustom/index.js'

// 核心插件
import kmChannel from './plugin/kmChannel'

// 核心插件
Vue.use(kmChannel)
Vue.component('TreeCustom', TreeCustom)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
