import router from '@/router'
import store from '@/store'
import { getLocal } from '@/utils/storage'

router.beforeEach((to, from, next) => {
  // Vuex获取获取权限信息
  const hasToken = getLocal('token')
  if (hasToken) {
    if (to.name === 'login') {
      next()
    } else {
      // 如果vuex路由权限为空，则重新请求权限
      if (store.getters.routes.length === 0) {
        store
          .dispatch('GetMenuInfo')
          .then(() => {
            router.addRoutes(store.getters.routes)
            const goViewsMenus = store.getters.routes
            // 当权限接口返回权限为空时，跳转登录
            if (!goViewsMenus) {
              next({ name: 'login' })
            } else {
              // 是否跳转首页，路由信息含有首页则跳转home，没有则不跳转
              if (to.name === 'home') {
                for (let i of goViewsMenus) {
                  if (i.name === 'home') {
                    next({ name: 'home' })
                    break
                  } else {
                    next({ path: goViewsMenus[0].path + '/' + goViewsMenus[0].children[0].path + '/' + goViewsMenus[0].children[0].children[0].path })
                    break
                  }
                }
              } else {
                next({ ...to, replace: true })
              }
            }
          })
          .catch(error => {
            // 接口服务关闭时测试
            // store.dispatch('FedLogOut').then(() => {
            //   Message.error(error || '请重新登录')
            //   next({ name: 'home' })
            // })
          })
      } else {
        next()
      }
    }
  } else {
    if (to.name !== 'login') {
      if (to.query && Object.keys(to.query).length > 0) {
        next({ path: `/login?redirect=${to.path}&query=${JSON.stringify(to.query)}` })
      } else next({ name: 'login' })
    } else next()
  }
})

router.afterEach(() => {})
