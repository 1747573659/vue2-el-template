import Vue from "vue";
import Vuex from "vuex";
import allModules from './allModules'
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ...allModules
  }
});
