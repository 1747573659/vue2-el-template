import Vue from "vue";
import Vuex from "vuex";
import allModules from './allModules'
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    ...allModules
  }
})

export default store
