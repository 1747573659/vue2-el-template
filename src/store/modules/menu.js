import store from '../index'
import router from '@/router'

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
    if (view.meta.cache) state.cachedViews.push(view.name)
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
      if (state.cachedViews[i] === view.name) {
        state.cachedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_ALL_TAG_VIEW: state => {
    state.tagViews = [].concat(state.tagViews[0])
    state.cachedViews = []
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
  async closeTagView({ state, dispatch }, { tagName, current }) {
    let newPage = {}
    const isCurrent = current === tagName
    if (isCurrent) {
      const len = state.tagViews.length
      for (let i = 0; i < len; i++) {
        if (state.tagViews[i].fullPath === tagName) {
          newPage = i < len - 1 ? state.tagViews[i + 1] : state.tagViews[i - 1]
          break
        }
      }
    }
    const index = state.tagViews.findIndex(page => page.fullPath === tagName)
    if (index >= 0) {
      const removeTagView = state.tagViews.find(item => item.fullPath === tagName)
      dispatch('delTagView', removeTagView)
      dispatch('delCachedView', removeTagView)
    }
    if (isCurrent) {
      const { name = 'index', params = {}, query = {} } = newPage
      await router.push({ name, params, query })
    }
  },
  updateTagView({ state }, { tagRoute, title }) {
    const index = state.tagViews.findIndex(item => item.name === tagRoute.name)
    if (index === 0) return
    if (title) state.tagViews[index].title = title
    state.tagViews[index].fullPath = tagRoute.fullPath
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
  },
  delAllTagView({ commit }) {
    commit('DEL_ALL_TAG_VIEW')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
