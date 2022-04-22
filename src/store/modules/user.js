import dayjs from 'dayjs'
import router from '@/router'
import { setLocal, removeLocal } from '@/utils/storage'
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
  checkPwdVisible: state => state.checkPwdVisible,
  checkProtocolStatus: state => state.checkProtocolStatus
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

const getAuditStatus = commit => {
  popUpsByAuditStatus()
    .then(res => commit('SET_AUDITSTATUS', Boolean(res)))
    .catch(() => {})
}

const actions = {
  login({ commit }, userInfo) {
    let userData = deepClone(userInfo)
    userData.password = MD5Util.md5(userData.password)
    const { userName, password, codeKey } = userData
    return new Promise((resolve, reject) => {
      login({ userName: userName.replace(/\s/g, ''), password: password.replace(/\s/g, ''), codeKey: codeKey })
        .then(response => {
          setLocal('token', response.token)
          // 判断是否有未处理享付通进件资料
          getAuditStatus(commit)
          // 获取该经销商下商户未开通享钱的列表
          authShopPageMethod(commit, response.userInfo)
          // 判断当前密码是否初始密码
          if (userData.password === '21218cca77804d2ba1922c33e0151105') {
            sessionStorage.setItem('isInitPwd', true)
            commit('SET_PWDVISIBLE', true)
          }
          // 重新设置异步路由里面的重定向地址
          const treeRoute = routeTree(response.menus)
          const convertTreeRouter = convertRouter(treeRoute, asyncRouterMap)
          let redirectList = resetRedirect(convertTreeRouter)
          commit('SET_ROUTES', [...redirectList])
          router.addRoutes(state.routes)

          // 获取登陆商户信息
          queryBaseInfo()
            .then(info => {
              setLocal('userInfo', JSON.stringify(Object.assign(response.userInfo, info)))
              if (info.level === 1 && [1, 2].includes(info.propertyType) && response.userInfo.userType === 11) {
                queryByAgent({ agentId: info.agentId })
                  .then(res => {
                    commit('SET_PROTOCOLSTATUS', !res)
                  })
                  .catch(() => {})
              }
            })
            .catch(() => {})
            .finally(() => {
              resolve()
            })
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  Logout() {
    return new Promise(resolve => {
      logout()
        .then(() => {
          removeLocal('token')
          removeLocal('userInfo')
          window.location.reload()
          resolve()
        })
        .catch(() => {})
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
          const treeRoute = routeTree(res)
          const convertTreeRouter = convertRouter(treeRoute, asyncRouterMap)
          let redirectList = resetRedirect(convertTreeRouter)
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
