import request from '@/utils/request'

const urlLinks = {
  // 分页查询
  queryPage: '/archive/xdd/queryPage',
  // 行业类别接口
  getWftAllTrade: '/archive/xdd/getWftAllTrade',
  // 查询所有证书类型
  queryCertType: '/archive/xdd/queryCertType',
  // 分页查询商户信息
  queryShopListByPage: '/shop/queryShopListByPage',
  // 开户支行
  getBankCnapByName: '/archive/xdd/getBankCnapByName',
  // 是否显示享钱汇商费率
  isShowRate: '/archive/xdd/isShowRate',
  // 提交审核（提交到BOSS审核）
  audit: '/archive/xdd/audit',
  // 提交资料（不提交到BOSS审核）
  submit: '/archive/xdd/submit',
  // 拒绝
  refuse: '/archive/xdd/refuse',
  // 查询授权状态
  queryAuthorizationStatus: '/archive/xdd/queryAuthorizationStatus',
  // 微信实名认证状态查询
  queryCertificationStatus: '/archive/xdd/queryCertificationStatus',
  // 启用/停用
  stopUse: '/archive/xdd/stopUse',
  // 进件详情
  queryXftPage: '/archive/xdd/queryXftPage',
  // 详情
  detail: '/archive/xdd/detail'
}
// 分页查询
export function queryPage(data) {
  return request({
    url: urlLinks.queryPage,
    method: 'POST',
    data
  })
}

// 行业类别接口
export function getWftAllTrade(params) {
  return request({
    url: urlLinks.getWftAllTrade,
    method: 'POST',
    params
  })
}
// 查询所有证书类型
export function queryCertType(params) {
  return request({
    url: urlLinks.queryCertType,
    method: 'POST',
    params
  })
}

// 查询所有证书类型
export function queryShopListByPage(data) {
  return request({
    url: urlLinks.queryShopListByPage,
    method: 'POST',
    data
  })
}
// 开户支行
export function getBankCnapByName(data) {
  return request({
    url: urlLinks.getBankCnapByName,
    method: 'POST',
    data
  })
}
// 是否显示享钱汇商费率
export function isShowRate(data) {
  return request({
    url: urlLinks.isShowRate,
    method: 'POST',
    data
  })
}
// 提交审核（提交到BOSS审核）
export function audit(data) {
  return request({
    url: urlLinks.audit,
    method: 'POST',
    data
  })
}
// 提交资料（不提交到BOSS审核）
export function submit(data) {
  return request({
    url: urlLinks.submit,
    method: 'POST',
    data
  })
}
// 拒绝
export function refuse(data) {
  return request({
    url: urlLinks.refuse,
    method: 'POST',
    data
  })
}
// 查询授权状态
export function queryAuthorizationStatus(data) {
  return request({
    url: urlLinks.queryAuthorizationStatus,
    method: 'POST',
    data
  })
}
// 微信实名认证状态查询
export function queryCertificationStatus(data) {
  return request({
    url: urlLinks.queryCertificationStatus,
    method: 'POST',
    data
  })
}
// 启用/停用
export function stopUse(data) {
  return request({
    url: urlLinks.stopUse,
    method: 'POST',
    data
  })
}
// 进件详情
export function queryXftPage(data) {
  return request({
    url: urlLinks.queryXftPage,
    method: 'POST',
    data
  })
}
// 详情
export function detail(data) {
  return request({
    url: urlLinks.detail,
    method: 'POST',
    data
  })
}
