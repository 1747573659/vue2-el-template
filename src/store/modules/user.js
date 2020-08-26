import { setLocal, removeLocal } from '@/utils/request/token'
import MD5Util from '@/utils/MD5Util'
import { login } from '@/api/login'

const state = {
  token: '', // 用户token
  routes: '', // 路由权限
  userInfo: {}, // 用户信息
}

const getters = {
  token: state => state.token,
  routes: state => state.routes,
  userInfo: state => state.userInfo
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    userInfo.password = MD5Util.md5(userInfo.password)
    return new Promise((resolve, reject) => {
      login({ username: username.replace(/\s/g, ''), password: password.replace(/\s/g, '') }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_ROUTES', data.menus)
        commit('SET_USER_INFO', data.userInfo)
        setLocal('token', data.token)
        setLocal('routes', data.menus)
        setLocal('userInfo', data.userInfo)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  Logout({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROUTES', [])
      commit('SET_USER_INFO', {})
      removeLocal('token')
      removeLocal('routes')
      removeLocal('userInfo')
      resolve()
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
