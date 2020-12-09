import request from '@/utils/request'

const urlLinks = {
  queryChannel: '/agent/queryChannel',
  queryAgentPage: '/agent/queryAgentPage',
  queryAgentPageNew: '/agent/queryAgentPage',
  updateStatus: '/agent/updateStatus',
  queryAgentById: '/agent/queryAgentById',
  queryRole: '/role/queryRole',
  addAgent: '/agent/addAgent',
  deleteChannel: '/agent/deleteChannel',
  queryPage: '/role/queryPage',
  addChannel: '/agent/addChannel',
  deleteSysRole: '/role/deleteSysRole',
  queryAppQuotaAndPrice: '/agent/queryAppQuotaAndPrice',
  queryAgentAppAndQuota: '/agent/queryAgentAppAndQuota',
  distributeAppQuota: '/agent/distributeAppQuota',
  queryDistricDto: '/district/queryDistricDto',
  checkAgentName: '/agent/checkAgentName',
  checkChannelName: '/agent/checkChannelName',
}

// 查询渠道列表
export function queryChannel() {
  return request({
    url: urlLinks.queryChannel,
    method: 'post'
  })
}

// 分页查询代理商信息
export function queryAgentPage(data) {
  return request({
    url: urlLinks.queryAgentPage,
    method: 'post',
    data
  })
}
// 分页查询代理商信息
export function queryAgentPageNew(data) {
  return request({
    url: urlLinks.queryAgentPageNew,
    method: 'post',
    data
  })
}

// 批量启用/停用商户
export function updateStatus(data) {
  return request({
    url: urlLinks.updateStatus,
    method: 'post',
    params: data
  })
}

// 根据ID查询代理商详情
export function queryAgentById(data) {
  return request({
    url: urlLinks.queryAgentById,
    method: 'post',
    params: data
  })
}

// 查询所有角色
export function queryRole(data) {
  return request({
    url: urlLinks.queryRole,
    method: 'post',
    params: data
  })
}

// 新增/编辑代理商
export function addAgent(data) {
  return request({
    url: urlLinks.addAgent,
    method: 'post',
    data
  })
}

// 删除DB经理
export function deleteChannel(data) {
  return request({
    url: urlLinks.deleteChannel,
    method: 'post',
    params: data
  })
}

// 新增/修改DB经理
export function addChannel(data) {
  return request({
    url: urlLinks.addChannel,
    method: 'post',
    data
  })
}

// 分页角色列表
export function queryPage(data) {
  return request({
    url: urlLinks.queryPage,
    method: 'post',
    data
  })
}

// 删除角色
export function deleteSysRole(data) {
  return request({
    url: urlLinks.deleteSysRole,
    method: 'post',
    params: data
  })
}

// 根据ID查询配额详情
export function queryAppQuotaAndPrice(data) {
  return request({
    url: urlLinks.queryAppQuotaAndPrice,
    method: 'post',
    params: data
  })
}

// 获取应用额列表
export function queryAgentAppAndQuota() {
  return request({
    url: urlLinks.queryAgentAppAndQuota,
    method: 'post'
  })
}

// 分配应用额
export function distributeAppQuota(data) {
  return request({
    url: urlLinks.distributeAppQuota,
    method: 'post',
    data
  })
}

// 根据下级编码查询上级地区
export function queryDistricDto(data) {
  return request({
    url: urlLinks.queryDistricDto,
    method: 'post',
    data
  })
}

// 验证代理商存在
export function checkAgentName(data) {
  return request({
    url: urlLinks.checkAgentName,
    method: 'post',
    params: data
  })
}

// 查询DB经理名称是否存在
export function checkChannelName(data) {
  return request({
    url: urlLinks.checkChannelName,
    method: 'post',
    params: data
  })
}