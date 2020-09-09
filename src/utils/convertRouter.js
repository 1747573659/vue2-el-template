import deepClone from '@/utils/deepClone'
import store from '@/store'

// 递归输出路由树,menu初始为接口返回的权限路由, asyncRouterMap为本地业务模块路由
export default function convertRouter(menu = [], asyncRouterMap = []) {
  if (menu) {
    const accessedRouters = []
    // Array.from 将类数组转换为真正的数组
    menu = Array.from(menu)
    asyncRouterMap = Array.from(asyncRouterMap)
    asyncRouterMap.forEach(asyncRouterItem => {
      menu.forEach(item => {
        const temp = { ...asyncRouterItem }
        let tempArr = deepClone(accessedRouters)
        // 判断是不是没有code值和children项，没有的话就添加
        if (!temp.code && !temp.children) {
          let isRepeat = tempArr.filter(i => i.name === temp.name && i.path === temp.path)
          // 过滤重复的添加的路由
          if (!isRepeat.length) accessedRouters.push(temp)
        }
        // 如果code和前端路由的code一致，那么添加的异步路由中
        if (temp.code === item.code) {
          // 如果当前级别路由有子级,则去判断当前路由是否为三级路由，是则将children添加到权限按钮列表，否则进行递归判断子级路由的权限
          if (item.children && item.children.length) {
            if (item.lever === 3) {
              store.dispatch('SetBtns', item.children)
            } else {
              temp.children = convertRouter(item.children, temp.children)
            }
          }
          accessedRouters.push(temp)
        }
      })
    })
    return accessedRouters
  } else {
    return []
  }
}
