import setting from './modules/setting'

export const routes = [
  {
    path: '/',
    redirect: '/setting',
    component: () => import('@/views/layout/layout.vue'),
  },
  {
    path: '/login',
    code: 'KM_DEFAULT_CODE',
    name: 'login',
    component: () => import('@/views/login/login.vue')
  },
  setting
]