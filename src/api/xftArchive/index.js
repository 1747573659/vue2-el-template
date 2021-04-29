import request from '@/utils/request'
import axios from 'axios'
import qs from 'qs'

const urlLinks = {
  // 分页查询
  queryPage: '/archive/xdd/queryPage',
  // 行业类别接口
  getWftAllTrade: '/archive/xdd/getWftAllTrade',
  // 查询所有证书类型
  queryCertType: '/archive/xdd/queryCertType',
  // 分页查询商户信息
  queryShopListByPage: '/shop/queryShopListByNameAndId',
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
  detail: '/archive/xdd/detail',
  // 子商户号授权
  queryContactInfo: '/archive/xdd/queryContactInfo',
  // 商户扫码认证（微信实名认证）
  queryContactQrCode: '/archive/xdd/queryContactQrCode',
  // 查询子商户号
  querySubMerchantNo: '/archive/xdd/querySubMerchantNo',
  querySubMchIdForSxf: '/archive/xdd/querySubMchIdForSxf',
  querySubMchIdHk: '/archive/xdd/querySubMchIdHk',
  queryTotalByStatus: '/archive/xdd/queryTotalByStatus',
  // 通道下拉列表查询
  queryBankChannelType: '/archive/xdd/queryBankChannelType',
  // 电子签约
  mchICBSign: '/archive/xdd/mchICBSign',
  queryCommunicationMerchantInfo: '/archive/xdd/queryCommunicationMerchantInfo',
  delList: 'archive/general/del',
  imageOCR: 'common/imageOcr',
  // 导出
  export: '/archive/xdd/export',
  // 导出记录
  exportLog: '/export/log',
}

export function xftArchiveExportDel(data) {
  return request({
    url: `${urlLinks.exportLog}/${data.id}/del`,
    method: 'post'
  })
}

export function xftArchiveExportLog(data) {
  return request({
    url: `${urlLinks.exportLog}/page`,
    method: 'post',
    data
  })
}

export function xftArchiveExport(data) {
  return request({
    url: `${urlLinks.export}/${data.menu}`,
    method: 'post',
    data: data.params
  })
}

// 通道下拉列表查询
export function queryBankChannelType() {
  return request({
    url: urlLinks.queryBankChannelType,
    method: 'POST'
  })
}

// 查询商户信息
export function queryCommunicationMerchantInfo(data) {
  return request({
    url: urlLinks.queryCommunicationMerchantInfo,
    method: 'POST',
    params: data
  })
}
// 电子签约
export function mchICBSign(data) {
  return axios({
    url: process.env.VUE_APP_BASE_API + urlLinks.mchICBSign,
    method: 'POST',
    params: data,
    headers: {
      token: localStorage.getItem('token') || ''
    },
    responseType: 'arraybuffer'
  })
}
// 图片识别
export function imageOCR(data) {
  return request({
    url: urlLinks.imageOCR,
    method: 'POST',
    data,
    timeout: 1 * 60 * 1000 // 分 * 秒 * 毫秒
  })
}

// 删除草稿
export function delList(data) {
  return request({
    url: `${urlLinks.delList}/${data.id}`,
    method: 'POST'
  })
}

// 汇总统计
export function queryTotalByStatus(data) {
  return request({
    url: urlLinks.queryTotalByStatus,
    method: 'POST',
    data
  })
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
    data: qs.stringify(data)
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
// 子商户号授权
export function queryContactInfo(data) {
  return request({
    url: urlLinks.queryContactInfo,
    method: 'POST',
    data
  })
}
// 商户扫码认证（微信实名认证）
export function queryContactQrCode(data) {
  return request({
    url: urlLinks.queryContactQrCode,
    method: 'POST',
    data
  })
}
// 查询子商户号
export function querySubMerchantNo(data) {
  return request({
    url: urlLinks.querySubMerchantNo,
    method: 'POST',
    data
  })
}
// 查询子商户号
export function querySubMchIdForSxf(data) {
  return request({
    url: urlLinks.querySubMchIdForSxf,
    method: 'POST',
    data
  })
}
// 查询子商户号
export function querySubMchIdHk(data) {
  return request({
    url: urlLinks.querySubMchIdHk,
    method: 'POST',
    data
  })
}