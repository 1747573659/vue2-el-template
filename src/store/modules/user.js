import MD5Util from '@/utils/MD5Util'
import routeTree from '@/utils/routeTree'
import { setLocal, removeLocal } from '@/utils/token'
import { login, getMenuInfo, logout } from '@/api/login'
import { constantRoutes, asyncRouterMap } from '@/router/routes'
import convertRouter from '@/utils/convertRouter'
import deepClone from '@/utils/deepClone'
import router from '@/router'

// 返回重定向的路径（都是子项目里面的第一个元素地址，children[0].path）
export function returnRedirectPath(obj) {
  let path = obj.path + '/'
  if (obj.children && obj.children.length) {
    path += returnRedirectPath(obj.children[0])
  }
  return path
}

// 为菜单重新设置重定向地址
export function resetRedirect(asyncRouterMap) {
  Array.from(asyncRouterMap).forEach(item => {
    if (!item.redirect) {
      item.redirect = returnRedirectPath(item).lastIndexOf('/') >= 0 ? returnRedirectPath(item).substring(0, returnRedirectPath(item).lastIndexOf('/')) : returnRedirectPath(item)
    }
  })
  return asyncRouterMap
}

const state = {
  routes: [], // 路由权限
  btns: []
}

const getters = {
  routes: state => state.routes,
  btns: state => state.btns
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    const abnormalRouter = { path: '*', redirect: '/404', code: 'KM_DEFAULT_CODE', hidden: true }
    state.routes = constantRoutes.concat(routes).concat(abnormalRouter)
  },
  SET_BTNS: (state, btns) => {
    state.btns = state.btns.concat(btns)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    let userData = deepClone(userInfo)
    userData.password = MD5Util.md5(userData.password)
    const { userName, password, codeKey } = userData
    return new Promise((resolve, reject) => {
      login({ userName: userName.replace(/\s/g, ''), password: password.replace(/\s/g, ''), codeKey: codeKey })
        .then(response => {
          // 重新设置异步路由里面的重定向地址
          let redirectList = resetRedirect(convertRouter(routeTree(response.menus), asyncRouterMap))
          commit('SET_ROUTES', [...redirectList])
          router.addRoutes(state.routes)
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
      logout()
        .then(() => {
          removeLocal('token')
          removeLocal('userInfo')
          window.location.reload()
          resolve()
        })
        .catch(error => {})
    })
  },

  // 前端 登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_ROUTES', [])
      removeLocal('token')
      removeLocal('userInfo')
      resolve()
    })
  },

  // 获取路由信息
  GetMenuInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getMenuInfo()
        .then(res => {
          // 重新设置异步路由里面的重定向地址
          let redirectList = resetRedirect(convertRouter(routeTree(res), asyncRouterMap))
          commit('SET_ROUTES', [...redirectList])
          resolve()
        })
        .catch(error => {
          commit('SET_ROUTES', [...constantRoutes])
          reject(error)
        })
    })
  },
  // 添加按钮权限
  SetBtns({ commit }, list) {
    commit('SET_BTNS', list)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
