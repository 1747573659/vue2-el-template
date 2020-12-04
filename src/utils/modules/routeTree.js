// 树形权限生成函数
export default function routeTree(routes) {
  // 根据id对权限进行排序
  routes.sort((a,b) => a.id - b.id)
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
// 树形权限生成函数
export  function routeTreeLevel(routes) {
  // 根据id对权限进行排序
  let arr=[]
  routes.sort((a,b) => a.id - b.id)
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
      arr.push(item)
    } else {
      item.lever = 1
      newRouteTree.push(item)
      arr.push(item)
    }
  })
  return arr
}


// 数据排序
function compare(property) {
  return function (a, b) {
    let value1 = a[property];
    let value2 = b[property];
    return value1 - value2;
  };
}
// 排序数据
export function sortData(arr = []) {
  arr = arr.sort(compare("sort"));
  arr.map((item) => {
    if (item.children && item.children.length) {
      sortData(item.children); //递归
    }
  });
  return arr;
}
