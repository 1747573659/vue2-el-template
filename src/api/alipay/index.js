import request from '@/utils/request'

const urlLinks = {
  auditApply: '/alipay/mini/auditApply',
  auditReApply: '/alipay/mini/auditReApply',
  createLinkUrl: '/alipay/mini/createLinkUrl',
  modifyBaseData: '/alipay/mini/modifyBaseData',
  saveBaseData: '/alipay/mini/saveBaseData',
  queryPage: '/alipay/mini/queryPage',
  queryCategory: '/alipay/mini/queryCategory',
  queryArea: '/alipay/mini/queryArea',
}
export function queryArea(data) {
  return request({
    url: urlLinks.queryArea,
    method: 'post',
    data
  })
}
export function queryCategory(data) {
  return request({
    url: urlLinks.queryCategory,
    method: 'post',
    data
  })
}
export function queryPage(data) {
  return request({
    url: urlLinks.queryPage,
    method: 'post',
    data
  })
}
export function saveBaseData(data) {
  return request({
    url: urlLinks.saveBaseData,
    method: 'post',
    params: data
  })
}
export function modifyBaseData(data) {
    return request({
      url: urlLinks.modifyBaseData,
      method: 'post',
      params: data
    })
  }
export function createLinkUrl(data) {
    return request({
      url: urlLinks.createLinkUrl,
      method: 'post',
      params: data
    })
  }
export function auditReApply(data) {
    return request({
      url: urlLinks.auditReApply,
      method: 'post',
      params: data
    })
  }
export function auditApply(data) {
  return request({
    url: urlLinks.auditApply,
    method: 'post',
    params: data
  })
}