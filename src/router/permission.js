import router from '@/router'
import store from '@/store'
import { getLocal } from '@/utils/token'

router.beforeEach((to, from, next) => {
  // Vuex获取获取权限信息
  const hasToken = getLocal('token')
  if (hasToken) {
    const goViewsMenus = store.getters.routes
    console.info(goViewsMenus)
    if(!goViewsMenus){
      
    }
    // store.dispatch('GetMenuInfo').then(() => {
    //   router.addRoutes(store.getters.routes)
    //   if (to.name === 'login') {
    //     next()
    //   } else {
    //     next()
    //   }
    // })
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
