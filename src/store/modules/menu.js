import store from '../index'

const state = {
  asideRoutes: [], // 路由权限
  basePath: '', // 基础路由
  tagViews: [], // 活跃tag导航
  cachedViews: [] // keep-alive 缓存页面
}

const getters = {
  asideRoutes: state => state.asideRoutes,
  basePath: state => state.basePath,
  tagViews: state => state.tagViews,
  cachedViews: state => state.cachedViews
}

const mutations = {
  SET_ASIDE_ROUTES: (state, routes) => {
    state.asideRoutes = [].concat(routes)
  },
  SET_BASE_PATH: (state, basePath) => {
    state.basePath = basePath
  },
  SET_TAG_VIEWS: (state, view) => {
    if (state.tagViews.some(item => item.path === view.path)) {
      if (view.query) {
        for (let i of state.tagViews) {
          if (i.path === view.path) i.query = view.query
        }
      }
      return
    }
    state.tagViews.push(Object.assign({}, view, { title: view.meta.title || 'no-name' }))
    const menus = store.getters.routes
    if (menus && menus.length) {
      for (let i of menus) {
        // 当name为home时，tagViews包含homePage，return 不包含unshift插入
        if (i.name === 'home') {
          let homePage = {
            path: '/home',
            fullPath: '/home',
            name: 'homeIndex',
            title: '首页',
            query: {}
          }
          if (state.tagViews.some(item => item.path === homePage.path)) return
          state.tagViews.unshift(homePage)
          break
        }
      }
    }
  },
  SET_CACHE_VIEWS: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.cache) state.cachedViews.push(view.name)
  },
  DEL_TAG_VIEW: (state, view) => {
    for (let i = 0; i < state.tagViews.length; i++) {
      if (state.tagViews[i].path === view.path) {
        state.tagViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state, view) => {
    for (let i = 0; i < state.cachedViews.length; i++) {
      if (state.cachedViews[i].path === view.path) {
        state.cachedViews.splice(i, 1)
        break
      }
    }
  }
}

const actions = {
  setAsideRoutes({ commit }, routes) {
    commit('SET_ASIDE_ROUTES', routes)
  },
  setBasePath({ commit }, basePath) {
    commit('SET_BASE_PATH', basePath)
  },
  setTagViews({ commit }, view) {
    commit('SET_TAG_VIEWS', view)
  },
  setCachedViews({ commit }, view) {
    commit('SET_CACHE_VIEWS', view)
  },
  delTagView({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_TAG_VIEW', view)
      resolve([...state.tagViews])
    })
  },
  delCachedView({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cachedViews])
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
