import router from '@/router'
import localStorage from '@/libs/utils.local'

router.beforeEach((to, from, next) => {
  // Vuex获取获取权限信息
  const getPermission = localStorage.get('permission')
  const hasToken = localStorage.get('token')
  if (hasToken) {
    if (to.path === '/login') {
      if (!getPermission) next()
      else {
        // 路由权限存在的时候，有首页权限的时候，跳转首页，没有则跳转当前路由的第一页
        // for (let i of goViewsMenus) {
        //   if (i.name === 'userPay') {
        //     next('/')
        //     break
        //   } else {
        //     next({ path: goViewsMenus[0].path + '/' + goViewsMenus[0].children[0].path + '/' + goViewsMenus[0].children[0].children[0].path })
        //     break
        //   }
        // }
      }
    } else {
      // 跳转页不是首页时，判断当前用户是否已拉取完user_info信息
      // if (store.getters.addRouters.length === 0) {
      //   // 判断当前用户是否已拉取完user_info信息
      //   store
      //     .dispatch('GetUserInfo')
      //     .then((res: any): any => {
      //       // 拉取user_info
      //       // const roles = res.data.roles // note: roles must be a array! such as: ['editor','develop']
      //       const menus = res.data.menus
      //       if (menus.length === 0) {
      //         return false
      //       }
      //       store.dispatch('GenerateRoutes', { menus }).then(() => {
      //         router.addRoutes(store.getters.addRouters)
      //         if (!goViewsMenus) {
      //           next({ path: '/login' })
      //         } else {
      //           if (to.path === '/userPay') {
      //             for (let i of goViewsMenus) {
      //               if (i.name === 'userPay') {
      //                 next('/')
      //                 break
      //               } else {
      //                 next({ path: goViewsMenus[0].path + '/' + goViewsMenus[0].children[0].path + '/' + goViewsMenus[0].children[0].children[0].path })
      //                 break
      //               }
      //             }
      //           } else {
      //             next({ ...to, replace: true })
      //           }
      //         }
      //       })
      //     })
      //     .catch((err: any): any => {
      //       store.dispatch('FedLogOut').then(() => {
      //         Message.error(err || '请重新登录')
      //         next({ path: '/' })
      //       })
      //     })
      // } else {
      //   next()
      // }
    }
  } else {
    if (to.path !== '/login') {
      if (to.query) {
        next({ path: `/login?redirect=${to.path}&query=${JSON.stringify(to.query)}` })
      } else {
        next({ name: 'login' })
      }
    } else {
      next()
    }
  }
})

router.afterEach(() => {})
