import request from '@/utils/request'

const urlLinks = {
  // 分页角色列表
  queryPage: '/employeeRole/queryPage',
  // 删除角色
  deleteSysRole: '/employeeRole/deleteSysRole',
  // 查询所有账号
  queryUserPage: '/employeeUser/queryUserPage',
  // 查询所有角色
  queryRole: '/employeeUser/queryRole',
  // 账号 启用/停用
  updateStatus: '/employeeUser/updateStatus',
  // 账号 重置密码
  resetPassword: '/employeeUser/resetPassword',
  // 删除账号
  deleteUser: '/employeeUser/deleteUser',
  // 新增编辑账号
  insertRole: '/employeeUser/insertRole',
  // 检测账号
  checkMobile: '/employeeUser/checkMobile',
  // 通过ID查询指定账号
  queryUserById: '/employeeUser/queryUserById',
  // 新增/编辑角色
  addRole: '/employeeRole/addRole',
  // 查看指定角色PC全部权限
  queryRoleById: '/employeeRole/queryRoleById',
  // 查看指定角色APP权限/全部权限)
  queryAllAPPMenu: '/employeeRole/queryAllAPPMenu',
  // 查看指定角色PC权限/全部权限
  queryAllPCMenu: '/employeeRole/queryAllPCMenu',
  // 查看指定角色PC权限/全部权限
  checkRoleName: '/employeeRole/checkRoleName'
}
// 校验角色重名
export function checkRoleName(data) {
  return request({
    url: urlLinks.checkRoleName,
    method: 'post',
    params: data
  })
}
// 通过ID查询指定角色
export function queryRoleById(data) {
  return request({
    url: urlLinks.queryRoleById,
    method: 'post',
    params: data
  })
}
// 新增/编辑角色
export function addRole(data) {
  return request({
    url: urlLinks.addRole,
    method: 'post',
    data: data
  })
}
// 通过ID查询指定账号
export function queryUserById(data) {
  return request({
    url: urlLinks.queryUserById,
    method: 'post',
    params: data
  })
}
// 检测账号
export function checkMobile(data) {
  return request({
    url: urlLinks.checkMobile,
    method: 'post',
    params: data
  })
}
// 新增编辑账号
export function insertRole(data) {
  return request({
    url: urlLinks.insertRole,
    method: 'post',
    data: data
  })
}
// 删除账号
export function deleteUser(data) {
  return request({
    url: urlLinks.deleteUser,
    method: 'post',
    params: data
  })
}
// 账号 重置密码
export function resetPassword(data) {
  return request({
    url: urlLinks.resetPassword,
    method: 'post',
    params: data
  })
}
// 账号 启用/停用
export function updateStatus(data) {
  return request({
    url: urlLinks.updateStatus,
    method: 'post',
    params: data
  })
}
// 查询所有角色
export function queryRole(data) {
  return request({
    url: urlLinks.queryRole,
    method: 'post',
    data: data
  })
}
// 查询所有账号
export function queryUserPage(data) {
  return request({
    url: urlLinks.queryUserPage,
    method: 'post',
    data: data
  })
}
// 查看指定角色PC权限/全部权限
export function queryAllPCMenu(data) {
  return request({
    url: urlLinks.queryAllPCMenu,
    method: 'post',
    params: data
  })
}
// 查看指定角色APP权限/全部权限)
export function queryAllAPPMenu(data) {
  return request({
    url: urlLinks.queryAllAPPMenu,
    method: 'post',
    params: data
  })
}
// 删除角色
export function queryPage(data) {
  return request({
    url: urlLinks.queryPage,
    method: 'post',
    data: data
  })
}
// 分页角色列表
export function deleteSysRole(data) {
  return request({
    url: urlLinks.deleteSysRole,
    method: 'post',
    params: data
  })
}
