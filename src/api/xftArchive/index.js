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
  getBankCnapByName: '/archive/xdd/getBankCnapByName'
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
