// 返回重定向的路径（都是子项目里面的第一个元素地址，children[0].path）
export function returnRedirectPath(obj) {
  let path = obj.path + '/'
  if (obj.children && obj.children.length) {
    path += returnRedirectPath(obj.children[0])
  }
  return path
}

// 为菜单重新设置重定向地址
export default function resetRedirect(asyncRouterMap) {
  Array.from(asyncRouterMap).forEach(item => {
    if (!item.redirect) {
      item.redirect = returnRedirectPath(item).lastIndexOf('/') >= 0 ? returnRedirectPath(item).substring(0, returnRedirectPath(item).lastIndexOf('/')) : returnRedirectPath(item)
    }
  })
  return asyncRouterMap
}
