const home = {
  path: '/home',
  redirect: '/home/index',
  code: 'KM_DEFAULT_CODE',
  name: 'home',
  component: () => import('@/views/layout/layout.vue'),
  meta: {
    title: '首页',
    name: 'home',
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/home/home.vue'),
      name: 'index',
      meta: { title: '首页', name: 'index' }
    },
  ]
}

export default home