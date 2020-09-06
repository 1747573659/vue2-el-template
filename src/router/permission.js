import router from '@/router'
import store from '@/store'
import { getLocal } from '@/utils/token'

// 伪代码
import { asyncRouterMap } from '@/router/routes'
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

router.beforeEach((to, from, next) => {
  store.commit('SET_ROUTES', resetRedirect(asyncRouterMap))
  router.addRoutes(store.getters.routes)
  next()
  // Vuex获取获取权限信息
  // const hasToken = getLocal('token')
  // if (hasToken) {
  //   if (to.name === 'login') {
  //     next()
  //   } else {
  //     if (store.getters.routes.length === 0) {
  //       store
  //         .dispatch('GetMenuInfo')
  //         .then(() => {
  //           router.addRoutes(store.getters.routes)
  //           const goViewsMenus = store.getters.routes
  //           if (!goViewsMenus) {
  //             next({ name: 'login' })
  //           } else {
  //             if (to.name === 'home') {
  //               for (let i of goViewsMenus) {
  //                 if (i.name === 'home') {
  //                   next({ name: 'home' })
  //                   break
  //                 } else {
  //                   next({ path: goViewsMenus[0].path + '/' + goViewsMenus[0].children[0].path + '/' + goViewsMenus[0].children[0].children[0].path })
  //                   break
  //                 }
  //               }
  //             } else {
  //               next({ ...to, replace: true })
  //             }
  //           }
  //         })
  //         .catch(error => {
  //           // 接口服务关闭时测试
  //           // store.dispatch('FedLogOut').then(() => {
  //           //   Message.error(error || '请重新登录')
  //           //   next({ name: 'home' })
  //           // })
  //         })
  //     } else {
  //       next()
  //     }
  //   }
  // } else {
  //   if (to.name !== 'login') {
  //     if (to.query && to.name !== '404') {
  //       next({ path: `/login?redirect=${to.path}&query=${JSON.stringify(to.query)}` })
  //     } else {
  //       next({ name: 'login' })
  //     }
  //   } else {
  //     next()
  //   }
  // }
})

router.afterEach(() => {})
