const routeTree = function (routes) {
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
      item.lever = parent.lever + 1;
      (parent.children || (parent.children = [])).push(item)
    } else {
      item.lever = 1
      newRouteTree.push(item)
    }
  })
  return newRouteTree
}

export default routeTree
