import setting from './modules/setting'
import home from './modules/home'

export const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/views/layout/layout.vue')
  },
  {
    path: '/login',
    code: 'KM_DEFAULT_CODE',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
  setting,
  home
]