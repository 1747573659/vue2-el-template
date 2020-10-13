import { _import } from '@/utils'

// 路由模块数据
import home from './modules/home'
import setting from './modules/setting'
import customer from './modules/customer'
import dataCenter from './modules/dataCenter'
import orderCenter from './modules/orderCenter'

// 系统主路由模块，包含登录，异常页，全局页面，其他页面按模块引入
const constantRoutes = [
  home,
  {
    path: '/login',
    name: 'login',
    code: 'KM_DEFAULT_CODE',
    component: _import('login/index'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    code: 'KM_DEFAULT_CODE',
    component: _import('abnormal/404'),
    hidden: true
  }
]

const asyncRouterMap = [
  customer,
  orderCenter,
  dataCenter,
  setting,
]

export { constantRoutes, asyncRouterMap }
