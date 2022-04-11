import request from '@/utils/request'

function composeBaseUrl(api, baseUrl = '') {
  return baseUrl + api
}

// 版本管理
export function getVersionList(data) {
  return request({
    url: composeBaseUrl('/ewechat/version/queryPage'),
    method: 'POST',
    data
  })
}

export function updateSaleStatus(data) {
  return request({
    url: composeBaseUrl('/ewechat/version/updateSaleStatus'),
    method: 'POST',
    data
  })
}

export function updateSort(data) {
  return request({
    url: composeBaseUrl('/ewechat/version/updateSort'),
    method: 'POST',
    data
  })
}

export function getMenuList() {
  return request({
    url: composeBaseUrl('/ewechat/version/menuList'),
    method: 'POST'
  })
}

export function saveVersion(data) {
  return request({
    url: composeBaseUrl('/ewechat/version/save'),
    method: 'POST',
    data
  })
}

export function getVersionDetail(data) {
  return request({
    url: composeBaseUrl('/ewechat/version/detail'),
    method: 'POST',
    data
  })
}

export function getSort(data) {
  return request({
    url: composeBaseUrl('/ewechat/version/getSort'),
    method: 'POST',
    data
  })
}

// 增购管理
export function getAddtionList(data) {
  return request({
    url: composeBaseUrl('/ewechat/addition/list'),
    method: 'POST',
    data
  })
}

export function updateAddtionStatus(data) {
  return request({
    url: composeBaseUrl('/ewechat/addition/status/sale/update'),
    method: 'POST',
    data
  })
}

export function updateAddtionSort(data) {
  return request({
    url: composeBaseUrl('/ewechat/addition/sort/update'),
    method: 'POST',
    data
  })
}

export function saveAddtion(data) {
  return request({
    url: composeBaseUrl('/ewechat/addition/create'),
    method: 'POST',
    data
  })
}

export function delAddtion(data) {
  return request({
    url: composeBaseUrl('/ewechat/addition/delete'),
    method: 'POST',
    data
  })
}

export function updateAddtion(data) {
  return request({
    url: composeBaseUrl('/ewechat/addition/update'),
    method: 'POST',
    data
  })
}

export function getAddtionDetail(data) {
  return request({
    url: composeBaseUrl('/ewechat/addition/queryById'),
    method: 'POST',
    data
  })
}

export function cancelOrder(data) {
  return request({
    url: composeBaseUrl('/ewechat/order/cancelOrder'),
    method: 'POST',
    data
  })
}

// 文件上传
export function uploadPic(data) {
  return request({
    url: composeBaseUrl('/uploadPic'),
    method: 'POST',
    headers: { 'content-type': 'multipart/form-data' },
    data
  })
}

/** ******************* 客户列表 *********************************************/
export function getAllVersionList(data) {
  return request({
    url: composeBaseUrl('/ewechat/version/list/dropDownBox'),
    method: 'POST',
    data
  })
}

export function getActiveVersionList(data) {
  return request({
    url: composeBaseUrl('/ewechat/version/list/active/dropDownBox'),
    method: 'POST',
    data
  })
}

export function updateChannel(data) {
  return request({
    url: composeBaseUrl('/ewechat/corp/version/channel/update'),
    method: 'POST',
    data
  })
}

export function updateExpireTime(data) {
  return request({
    url: composeBaseUrl('/ewechat/corp/version/expireTime/update'),
    method: 'POST',
    data
  })
}

export function getCorpVersionList(data) {
  return request({
    url: composeBaseUrl('/ewechat/corp/version/list'),
    method: 'POST',
    data
  })
}

export function updateCorpVersion(data) {
  return request({
    url: composeBaseUrl('/ewechat/corp/version/update'),
    method: 'POST',
    data
  })
}

export function getChannelList(data) {
  return request({
    url: composeBaseUrl('/ewechat/corp/version/channel/list'),
    method: 'POST',
    data
  })
}

/** ******************* 订单管理 *********************************************/
export function getOrderList(data) {
  return request({
    url: composeBaseUrl('/ewechat/order/list'),
    method: 'POST',
    data
  })
}

export function getOrderDetail(data) {
  return request({
    url: composeBaseUrl('/ewechat/order/details'),
    method: 'POST',
    data
  })
}

export function bindCorp(data) {
  return request({
    url: composeBaseUrl('/ewechat/order/corp/binding'),
    method: 'POST',
    data
  })
}

export function confirmReceipt(data) {
  return request({
    url: composeBaseUrl('/ewechat/order/confirmReceipt'),
    method: 'POST',
    data
  })
}

export function updateAmount(data) {
  return request({
    url: composeBaseUrl('/ewechat/order/amount/update'),
    method: 'POST',
    data
  })
}

export function getPayList(data) {
  return request({
    url: composeBaseUrl('/ewechat/order/list/receive'),
    method: 'POST',
    data
  })
}

export function getCorpList(data) {
  return request({
    url: composeBaseUrl('/ewechat/corp/list/dropDownBox'),
    method: 'POST',
    data
  })
}

export function getDownloadUrl(data) {
  return request({
    url: composeBaseUrl('/ewechat/order/getContractUrl'),
    method: 'POST',
    data
  })
}

export const downloadOrderList = '/ewechat/order/list/download'
export const downloadVersionList = '/ewechat/corp/version/list/download'
export const downloadPayList = '/ewechat/order/list/receive/download'
