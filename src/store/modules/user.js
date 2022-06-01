import dayjs from 'dayjs'
import router from '@/router'
import { setLocal, getLocal } from '@/utils/storage'
import { constantRoutes, asyncRouterMap } from '@/router/routes'
import { routeTree, convertRouter, MD5Util, deepClone, resetRedirect } from '@/utils'

import { login, getMenuInfo, logout, popUpsByAuditStatus, queryBaseInfo, queryByAgent } from '@/api/login'
import { authShopPage } from '@/api/customer/merchant'

const state = {
  routes: [], // 路由权限
  btns: [],
  xftAuditStatus: false,
  nonactivatedXq: false,
  nonactivatedXqList: [],
  checkPwdVisible: JSON.parse(sessionStorage.getItem('isInitPwd')) || false,
  checkProtocolStatus: false
}

const getters = {
  routes: state => state.routes,
  btns: state => state.btns,
  xftAuditStatus: state => state.xftAuditStatus,
  nonactivatedXq: state => state.nonactivatedXq,
  nonactivatedXqList: state => state.nonactivatedXqList,
  checkPwdVisible: state => state.checkPwdVisible
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    const abnormalRouter = { path: '*', redirect: '/404', code: 'KM_DEFAULT_CODE', hidden: true }
    // 拼装首页子路由
    if (routes.length > 0) {
      constantRoutes.forEach(item => {
        if (item.name === 'home') item.children = item.children.concat(routes[0].children)
        return item
      })
    }
    state.routes = routes.concat(constantRoutes).concat(abnormalRouter)
  },
  SET_BTNS: (state, btns) => {
    state.btns = state.btns.concat(btns)
  },
  SET_AUDITSTATUS: (state, status) => {
    state.xftAuditStatus = status
  },
  SET_NONACTIVATEDXQ: (state, status) => {
    state.nonactivatedXq = status
  },
  SET_NONACTIVATEDXQLIST: (state, list) => {
    state.nonactivatedXqList = state.nonactivatedXqList.concat(list || [])
  },
  SET_PWDVISIBLE: (state, status) => {
    state.checkPwdVisible = status
  },
  SET_PROTOCOLSTATUS: (state, status) => {
    state.checkProtocolStatus = status
  }
}

let page = 0,
  maxPage = false
const adminUserType = 11

const authShopPageMethod = (commit, { userType = 0 }) => {
  authShopPage({
    queryType: 2,
    page: ++page,
    rows: 10,
    xqUsedStatusList: [1, 2, 3],
    status: 0,
    startFirstLoginDate: dayjs().subtract(14, 'days').format('YYYY-MM-DD') + ' 00:00:00',
    endFirstLoginDate: dayjs().subtract(1, 'days').format('YYYY-MM-DD') + ' 23:59:59'
  }).then(res => {
    // 有一条不符合享钱开通条件的数据就弹出，只对类型是“经销商”的管理员弹出
    if (res && res.results) {
      commit('SET_NONACTIVATEDXQ', res.results.length > 0 && userType === adminUserType)
      commit('SET_NONACTIVATEDXQLIST', res.results)
      maxPage = res.results.length !== 10
    }
  })
}

const actions = {
  setRoutes({ commit }, routes) {
    const treeRoute = routeTree(routes)
    const convertTreeRouter = convertRouter(treeRoute, asyncRouterMap)
    let redirectList = resetRedirect(convertTreeRouter)
    commit('SET_ROUTES', [...redirectList])
  },
  getAuditStatus({ commit }) {
    // 判断是否有未处理享付通进件资料
    popUpsByAuditStatus()
      .then(res => commit('SET_AUDITSTATUS', Boolean(res)))
      .catch(() => {})
  },
  checkProtocol({ commit }) {
    // 是否展示返佣协议
    const userInfo = JSON.parse(getLocal('userInfo'))
    if (userInfo.level === 1 && [1, 2].includes(userInfo.propertyType) && userInfo.userType === 11) {
      queryByAgent({ agentId: userInfo.agentId })
        .then(res => {
          commit('SET_PROTOCOLSTATUS', !res)
        })
        .catch(() => {})
    }
  },
  getBaseInfo({ dispatch }, userInfo) {
    // 获取登陆商户信息
    return new Promise(resolve => {
      queryBaseInfo()
        .then(info => {
          setLocal('userInfo', JSON.stringify(Object.assign(userInfo, info)))
          dispatch('checkProtocol')
        })
        .catch(() => {})
        .finally(() => {
          resolve()
        })
    })
  },
  login({ commit, dispatch }, userInfo) {
    let userData = deepClone(userInfo)
    userData.password = MD5Util.md5(userData.password)
    const { userName, password, codeKey } = userData
    return new Promise((resolve, reject) => {
      login({ userName: userName.replace(/\s/g, ''), password: password.replace(/\s/g, ''), codeKey: codeKey })
        .then(response => {
          // 判断当前密码是否初始密码
          if (userData.password === '21218cca77804d2ba1922c33e0151105') {
            sessionStorage.setItem('isInitPwd', true)
            commit('SET_PWDVISIBLE', true)
          }
          setLocal('token', response.token)
          // 获取该经销商下商户未开通享钱的列表
          authShopPageMethod(commit, response.userInfo)
          dispatch('getAuditStatus')
          dispatch('getBaseInfo', response.userInfo).finally(() => resolve())
          dispatch('setRoutes', response.menus)
          router.addRoutes(state.routes)
        })
        .catch(error => reject(error))
    })
  },

  // user logout
  Logout() {
    return new Promise(resolve => {
      logout()
        .then(() => {
          localStorage.clear()
          location.reload()
          resolve()
        })
        .catch(() => {})
    })
  },

  // 前端 登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_ROUTES', [])
      localStorage.clear()
      resolve()
    })
  },

  // 获取路由信息
  GetMenuInfo({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      getMenuInfo()
        .then(res => {
          dispatch('setRoutes', res)
          if (location.href === '/home') dispatch('checkProtocol')
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
  },
  authShopPageMethodAction({ commit }) {
    // 当能下拉加载的时候userType必定为1，所以直接写死传进去就好
    !maxPage && authShopPageMethod(commit, { userType: adminUserType })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
