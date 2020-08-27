const routeTree = function (routes) {
  let routesMap = {}
  routes.forEach(item => {
    delete item.children
    routesMap[item.id] = item
  })
  let newRouteTree = []
  routes.forEach(item => {
    // 取出parentId
    let parent = routesMap[item.parentId]
    // 如果parentId不为零，即不为顶级，那么就向children字段推入item
    // 如果parentId为零则将其推入顶级
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      newRouteTree.push(item)
    }
  })
  return newRouteTree
}

export default routeTree
