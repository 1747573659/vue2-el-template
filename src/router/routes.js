// 路由模块数据
import home from './modules/home'
import setting from './modules/setting'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/utils/util.import.' + process.env.NODE_ENV)

// 系统主路由模块，包含登录，异常页，全局页面，其他页面按模块引入
const constantRoutes = [
  home,
  {
    path: '/login',
    name: 'login',
    code: 'KM_DEFAULT_CODE',
    component: _import('login/index')
  },
  {
    path: '/404',
    name: '404',
    code: 'KM_DEFAULT_CODE',
    component: _import('abnormal/404')
  },
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', code: 'KM_DEFAULT_CODE', hidden: true }
]

const asyncRouterMap = [...constantRoutes, setting]

export { constantRoutes, asyncRouterMap }
