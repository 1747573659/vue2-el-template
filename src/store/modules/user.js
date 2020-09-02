import { getLocal, setLocal, removeLocal } from '@/utils/token'
import MD5Util from '@/utils/MD5Util'
import { login } from '@/api/login'
import routeTree from '@/utils/routeTree'

const state = {
  token: getLocal('token'), // 用户 token
  routes: '', // 路由权限
  userInfo: {} // 用户信息
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
    userInfo.password = MD5Util.md5(userInfo.password)
    const { userName, password, codeKey } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: userName.replace(/\s/g, ''), password: password.replace(/\s/g, ''), codeKey: codeKey })
        .then(response => {
          commit('SET_TOKEN', response.token)
          commit('SET_ROUTES', routeTree(response.menus))
          commit('SET_USER_INFO', response.userInfo)
          setLocal('token', response.token)
          setLocal('userInfo', JSON.stringify(response.userInfo))
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  Logout({ commit }) {
    return new Promise(resolve => {
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
