import request from '@/utils/request'

const urlLinks = {
  queryShopListByPage: '/shop/queryShopListByPage',
  queryClerkList: '/shop/queryClerkList',
  queryAgentPage: '/agent/queryAgentPage',
  updateStatus: '/shop/updateStatus',
  addShop: '/shop/addShop',
  modifyShop: '/shop/modifyShop',
  queryShopById: '/shop/queryShopById',
  updateClerk: '/shop/updateClerk',
  queryTradeById: '/merchant/queryTradeById',
  queryProductInfoByIndustryId: '/merchant/queryProductInfoByIndustryId',
  queryMerchantListByPage: '/merchant/queryMerchantListByPage',
  branchUpdateStatus: '/merchant/updateStatus',
  deleteMerchant: '/merchant/deleteMerchant',
  queryMerchantById: '/merchant/queryMerchantById',
  queryDistricDto: '/district/queryDistricDto',
  addMerchant: '/merchant/addMerchant',
  checkShopName: '/shop/checkShopName',
  checkMerchant: '/merchant/checkMerchant',
}

// 分页查询商户信息
export function queryShopListByPage(data) {
  return request({
    url: urlLinks.queryShopListByPage,
    method: 'post',
    data
  })
}

// 查询业务员列表
export function queryClerkList() {
  return request({
    url: urlLinks.queryClerkList,
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

// 批量启用/停用
export function updateStatus(data) {
  return request({
    url: urlLinks.updateStatus,
    method: 'post',
    params: data
  })
}

// 新增商户
export function addShop(data) {
  return request({
    url: urlLinks.addShop,
    method: 'post',
    data
  })
}

// 编辑商户
export function modifyShop(data) {
  return request({
    url: urlLinks.modifyShop,
    method: 'post',
    data
  })
}

// 根据ID查询商户信息
export function queryShopById(data) {
  return request({
    url: urlLinks.queryShopById,
    method: 'post',
    params: data
  })
}

// 查询品牌行业列表
export function queryTradeById(data) {
  return request({
    url: urlLinks.queryTradeById,
    method: 'post',
    params: data
  })
}

// 查询ERP行业的产品
export function queryProductInfoByIndustryId(data) {
  return request({
    url: urlLinks.queryProductInfoByIndustryId,
    method: 'post',
    params: data
  })
}

// 分页查询品牌信息
export function queryMerchantListByPage(data) {
  return request({
    url: urlLinks.queryMerchantListByPage,
    method: 'post',
    data
  })
}

// 品牌启用/停用
export function branchUpdateStatus(data) {
  return request({
    url: urlLinks.branchUpdateStatus,
    method: 'post',
    params: data
  })
}

// 删除品牌
export function deleteMerchant(data) {
  return request({
    url: urlLinks.deleteMerchant,
    method: 'post',
    params: data
  })
}

// 删除品牌
export function queryMerchantById(data) {
  return request({
    url: urlLinks.queryMerchantById,
    method: 'post',
    params: data
  })
}

// 批量移交业务员
export function updateClerk(data) {
  return request({
    url: urlLinks.updateClerk,
    method: 'post',
    params: data
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

// 新增/编辑品牌
export function addMerchant(data) {
  return request({
    url: urlLinks.addMerchant,
    timeout: 10 * 1000,
    method: 'post',
    data
  })
}

// 验证商户管理员存在
export function checkShopName(data) {
  return request({
    url: urlLinks.checkShopName,
    method: 'post',
    params: data
  })
}

// 验证品牌存在
export function checkMerchant(data) {
  return request({
    url: urlLinks.checkMerchant,
    method: 'post',
    params: data
  })
}