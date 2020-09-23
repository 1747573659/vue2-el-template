import deepClone from './modules/deepClone'
import downloadForURL from './modules/download'
import convertRouter from './modules/convertRouter'
import routeTree from './modules/routeTree'
import MD5Util from './modules/MD5Util'
import _import from './modules/import'
import errorLog from './modules/errorLog'
import resetRedirect from './modules/resetRedirect'

import store from '@/store'
import { Message, MessageBox } from 'element-ui'
function permissonCheckMenus (code, url) {
  // console.log(code)
  let permissonMenus = store.getters.permissionMenus
  let routerServe = store.getters.permission_routers
  // console.log(JSON.stringify(routerServe))
  if (permissonMenus && permissonMenus.length) {
    if (url) {
      let urlArr = url.split('/')
      if (JSON.stringify(routerServe).includes(urlArr[1]) && JSON.stringify(routerServe).includes(urlArr[2]) && JSON.stringify(routerServe).includes(urlArr[3])) {
        // JSON.stringify(permissonMenus).includes(code)
        return JSON.stringify(permissonMenus).includes(code)
      } else {
        return false
      }
    }
    return JSON.stringify(permissonMenus).includes(code)
  }
}

export { deepClone, downloadForURL, routeTree, convertRouter, _import, resetRedirect, MD5Util, errorLog ,permissonCheckMenus}
