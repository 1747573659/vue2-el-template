import router from '@/router'
import store from '@/store'
import { getLocal } from '@/utils/token'

router.beforeEach((to, from, next) => {
  // Vuex获取获取权限信息
  const hasToken = getLocal('token')
  if (hasToken) {
    if (store.getters.routes.length === 0) {
      store.dispatch('GetMenuInfo').then(() => {
        router.addRoutes(store.getters.routes)
        const goViewsMenus = store.getters.routes
        if (!goViewsMenus) {
          next({ name: 'login' })
        } else {
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
    } else {
      next()
    }
  } else {
    if (to.name !== 'login') {
      if (to.query && to.name !== '404') {
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
