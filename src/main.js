import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import '@/assets/styleForUI/index.scss'
import '@/assets/styleForUI.scss'
import TreeCustom from '@/components/treeCustom/index.js'

Vue.component('TreeCustom', TreeCustom)
Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
