import { _import } from '@/utils'
import Layout from '@/layout'

export default {
  path: '/',
  redirect: '/home',
  code: 'KM_DEFAULT_CODE',
  name: 'home',
  component: Layout,
  hidden: true,
  meta: {
    title: '首页',
    name: 'home'
  },
  children: [
    {
      path: 'home',
      name: 'homeIndex',
      meta: { title: '首页', name: 'index' },
      component: _import('home/index'),
      hidden: true
    }
  ]
}
