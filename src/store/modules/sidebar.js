const state = {
  sidebarRoutes: [], // 路由权限
  basePath: ''
}

const getters = {
  sidebarRoutes: state => state.sidebarRoutes,
  basePath: state => state.basePath
}

const mutations = {
  SET_SIDEBAR_ROUTES: (state, routes) => {
    state.sidebarRoutes = [].concat(routes)
  },
  SET_BASE_PATH: (state, basePath) => {
    state.basePath = basePath
  }
}

const actions = {
  setSidebarROUTES({ commit }, routes) {
    if (routes) {
      commit('SET_SIDEBAR_ROUTES', routes)
    }
  },
  setBasePath({ commit }, basePath) {
    if (basePath) {
      commit('SET_BASE_PATH', basePath)
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
