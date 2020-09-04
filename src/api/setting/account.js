import request from '@/utils/request'

const urlLinks = {
  queryPage: '/employeeRole/queryPage',
  deleteSysRole: '/employeeRole/deleteSysRole',
  queryAPPMenuByRoleId: '/employeeRole/queryAPPMenuByRoleId',
  queryPCMenuByRoleId: '/employeeRole/queryPCMenuByRoleId',
}
export function queryPCMenuByRoleId(data) {
  return request({
    url: urlLinks.queryPCMenuByRoleId,
    method: 'post',
    params: data
  })
}
export function queryAPPMenuByRoleId(data) {
  return request({
    url: urlLinks.queryAPPMenuByRoleId,
    method: 'post',
    params: data
  })
}
export function queryPage(data) {
  return request({
    url: urlLinks.queryPage,
    method: 'post',
    data: data
  })
}
export function deleteSysRole(data) {
  return request({
    url: urlLinks.deleteSysRole,
    method: 'post',
    params: data
  })
}
