const state = {
  sidebarRoutes: [] // 路由权限
}

const getters = {
  sidebarRoutes: state => state.sidebarRoutes
}

const mutations = {
  SET_SIDEBAR_ROUTES: (state, routes) => {
    state.sidebarRoutes = [].concat(routes)
  }
}

const actions = {
  setSidebarROUTES({ commit }, routes) {
    if (routes) {
      commit('SET_SIDEBAR_ROUTES', routes)
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
