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
  queryAllStatus: '/alipay/mini/queryAllStatus',
  queryAllVersion: '/alipay/mini/queryAllVersion',
  versionUpload: '/alipay/mini/versionUpload',
  queryVersion: '/alipay/mini/queryVersion',
  queryAudit: '/alipay/mini/queryAudit',
  online: '/alipay/mini/online',
  offline: '/alipay/mini/offline',
  qrcodeCreate: '/alipay/mini/qrcodeCreate',
  versionReUpload: '/alipay/mini/versionReUpload',
  queryByDatumId: '/alipay/mini/queryByDatumId',
  modifyMiniDesc: '/alipay/mini/modifyMiniDesc'
}
export function modifyMiniDesc(data) {
  return request({
    url: urlLinks.modifyMiniDesc,
    method: 'post',
    data
  })
}
export function queryByDatumId(data) {
  return request({
    url: urlLinks.queryByDatumId,
    method: 'post',
    params: data
  })
}
export function versionReUpload(data) {
  return request({
    url: urlLinks.versionReUpload,
    method: 'post',
    data
  })
}
export function qrcodeCreate(data) {
  return request({
    url: urlLinks.qrcodeCreate,
    method: 'post',
    data
  })
}
export function offline(data) {
  return request({
    url: urlLinks.offline,
    method: 'post',
    data
  })
}
export function online(data) {
  return request({
    url: urlLinks.online,
    method: 'post',
    data
  })
}
export function queryAudit(data) {
  return request({
    url: urlLinks.queryAudit,
    method: 'post',
    data
  })
}
export function queryVersion(data) {
  return request({
    url: urlLinks.queryVersion,
    method: 'post',
    data
  })
}
export function versionUpload(data) {
  return request({
    url: urlLinks.versionUpload,
    method: 'post',
    data
  })
}
export function queryAllVersion(data) {
  return request({
    url: urlLinks.queryAllVersion,
    method: 'post',
    data
  })
}
export function queryAllStatus(data) {
  return request({
    url: urlLinks.queryAllStatus,
    method: 'post',
    data
  })
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
    data
  })
}
export function modifyBaseData(data) {
  return request({
    url: urlLinks.modifyBaseData,
    method: 'post',
    data
  })
}
export function createLinkUrl(data) {
  return request({
    url: urlLinks.createLinkUrl,
    method: 'post',
    data
  })
}
export function auditReApply(data) {
  return request({
    url: urlLinks.auditReApply,
    method: 'post',
    data
  })
}
export function auditApply(data) {
  return request({
    url: urlLinks.auditApply,
    method: 'post',
    data
  })
}
