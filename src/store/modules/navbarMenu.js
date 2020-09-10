import store from '../index'
const state = {
  sidebarRoutes: [], // 路由权限
  basePath: '', // 基础路由
  tagViews: [], // 活跃tag导航
  cacheViews: [] // keep-alive 缓存页面
}

const getters = {
  sidebarRoutes: state => state.sidebarRoutes,
  basePath: state => state.basePath,
  tagViews: state => state.tagViews,
  cacheViews: state => state.cacheViews
}

const mutations = {
  SET_SIDEBAR_ROUTES: (state, routes) => {
    state.sidebarRoutes = [].concat(routes)
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
        if (i.name === 'home') {
          let homePage = {
            path: '/home',
            fullPath: '/home/index',
            name: 'home',
            title: '首页',
            query: {}
          }
          if (state.tagViews.some(item => item.path === homePage.path)) return
          // state.tagViews.unshift(homePage)
          break
        }
      }
    }
  },
  SET_CACHE_VIEWS: (state, view) => {
    if (state.cacheViews.includes(view.name)) return
    if (!view.meta.noCache) state.cacheViews.push(view.name)
  },
  DEL_TAG_VIEWS: (state, view) => {
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
  setSidebarROUTES({ commit }, routes) {
    commit('SET_SIDEBAR_ROUTES', routes)
  },
  setBasePath({ commit }, basePath) {
    commit('SET_BASE_PATH', basePath)
  },
  setTagViews({ commit }, view) {
    commit('SET_TAG_VIEWS', view)
  },
  setCacheViews({ commit }, view) {
    commit('SET_CACHE_VIEWS', view)
  },
  delTagViews({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_TAG_VIEWS', view)
      resolve([...state.tagViews])
    })
  },
  delCacheViews({ commit }, view) {
    return new Promise(resolve => {
      commit('DEL_CACHED_VIEW', view)
      resolve([...state.cacheViews])
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
