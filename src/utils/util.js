import store from '@/store'

// 深拷贝 - 工具函数
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// 树形权限生成函数
export function routeTree(routes) {
  let routesMap = {}
  routes.forEach(item => {
    routesMap[item.id] = item
  })
  let newRouteTree = []
  routes.forEach(item => {
    // 取出parentId
    let parent = routesMap[item.parentId]
    // 如果parentId不为零，即不为顶级，那么就向children字段推入item
    // 如果parentId为零则将其推入顶级
    if (parent) {
      item.lever = parent.lever + 1
      ;(parent.children || (parent.children = [])).push(item)
    } else {
      item.lever = 1
      newRouteTree.push(item)
    }
  })
  return newRouteTree
}

// 递归输出路由树,menu初始为接口返回的权限路由, asyncRouterMap为本地业务模块路由
export function convertRouter(menu = [], asyncRouterMap = []) {
  if (menu) {
    const accessedRouters = []
    // Array.from 将类数组转换为真正的数组
    menu = Array.from(menu)
    asyncRouterMap = Array.from(asyncRouterMap)
    asyncRouterMap.forEach(asyncRouterItem => {
      const temp = { ...asyncRouterItem }
      // 如果为页面的附属页面，即为KM_DEFAULT_CODE，则添加到路由里面
      if (temp.code === 'KM_DEFAULT_CODE') accessedRouters.push(temp)
      menu.forEach(item => {
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

// 文件下载
export function downloadForURL(url) {
  let a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = name // 命名下载名称
  a.target = '_blank'
  a.click() // 点击触发下载
  window.URL.revokeObjectURL(url) // 下载完成进行释放
  document.body.removeChild(a)
}
