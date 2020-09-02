import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import allModules from './allModules'

export default new Vuex.Store({
  modules: {
    ...allModules
  }
});
