import Layout from '@/layout'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/utils/util.import.' + process.env.NODE_ENV)

const home = {
  path: '/home',
  redirect: '/home/index',
  code: 'KM_DEFAULT_CODE',
  name: 'home',
  component: Layout,
  meta: {
    title: '首页',
    name: 'home'
  },
  children: [
    {
      path: 'index',
      component: _import('home/index'),
      name: 'index',
      meta: { title: '首页', name: 'index' }
    }
  ]
}

export default home
