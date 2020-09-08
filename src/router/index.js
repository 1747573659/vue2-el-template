import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由数据
import { constantRoutes as routes } from './routes'

// 导出路由 在 main.js 里使用
const router = new VueRouter({
  routes,
  mode: 'history',
  base: process.env.NODE_ENV === 'production' && process.env.VUE_APP_FLAG === 'dev' ? '/kmchannel' : '',
  linkActiveClass: 'active-link', // 点击进行路由跳转时那个路由会添加active-link
  linkExactActiveClass: 'exact-active-link', // 路由路径完全匹配是点击的时候会有exact-active-link
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { y: 0 }
    }
  }
})

export default router
