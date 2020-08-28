const home = {
  path: '/home',
  redirect: '/home/index',
  code: 'KM_DEFAULT_CODE',
  name: 'home',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '首页',
    name: 'home',
  },
  children: [
    {
      path: 'index',
      component: () => import('@/pages/home/home.vue'),
      name: 'index',
      meta: { title: '首页', name: 'index' }
    },
  ]
}

export default home