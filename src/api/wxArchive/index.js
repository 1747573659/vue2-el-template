import request from '@/utils/request'
import qs from 'qs'

const urlLinks = {
  queryPage: 'archive/general/queryPage',
  xiaoWeiArchiveStatus: 'archive/general/xiaoWeiArchiveStatus',
  xiaoWeiUpgradeStatus: 'archive/general/xiaoWeiUpgradeStatus',
  generalStopUse: 'archive/general/stopUse',
  generalDetail: 'archive/general/generalDetail',
  queryShopListByPage: 'shop/queryShopListByNameAndId',
  queryBankPage: 'branch/queryBankPage',
  queryBranchPage: 'branch/queryBranchPage',
  submit: 'archive/general/submit',
  detail: 'archive/general/detail',
  refund: 'archive/general/refund',
  submitToVerify: 'archive/general/submitToVerify',
  businessCategory: 'archive/general/businessCategory',
  generalView: 'archive/general/view',
  queryBySubMchId: 'archive/general/queryBySubMchId',
  queryTotalByStatus: 'archive/general/queryTotalByStatus',
  delList: 'archive/general/del',
  imageOCR: 'common/imageOcr',
  searchCompanyInfo: 'common/searchCompanyInfo',
  queryArchiveDirectAuditStatus: 'archive/general/queryArchiveDirectAuditStatus',
  updateArchiveBaseDirectAuditStatus: 'archive/general/updateArchiveBaseDirectAuditStatus'
}

// 获取状态列表
export function updateArchiveBaseDirectAuditStatus(data) {
  return request({
    url: urlLinks.updateArchiveBaseDirectAuditStatus,
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 获取状态列表
export function queryArchiveDirectAuditStatus() {
  return request({
    url: urlLinks.queryArchiveDirectAuditStatus,
    method: 'POST'
  })
}

// 企查查
export function searchCompanyInfo(data) {
  return request({
    url: urlLinks.searchCompanyInfo,
    method: 'POST',
    data
  })
}

// 图片识别
export function imageOCR(data) {
  return request({
    url: urlLinks.imageOCR,
    method: 'POST',
    data: data,
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

// 验证账户
export function queryBySubMchId(data) {
  return request({
    url: urlLinks.queryBySubMchId,
    method: 'POST',
    data
  })
}

// 签约
export function generalView(data) {
  return request({
    url: `${urlLinks.generalView}/${data.id}/${data.flag}`,
    method: 'POST',
    responseType: 'arraybuffer'
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
// 小微进件状态列表
export function xiaoWeiArchiveStatus(data) {
  return request({
    url: urlLinks.xiaoWeiArchiveStatus,
    method: 'POST',
    data
  })
}
// 小微升级状态列表
export function xiaoWeiUpgradeStatus(data) {
  return request({
    url: urlLinks.xiaoWeiUpgradeStatus,
    method: 'POST',
    data
  })
}

// 启用/停用
export function generalStopUse(data) {
  return request({
    url: urlLinks.generalStopUse,
    method: 'POST',
    data
  })
}

// 进件详情
export function generalDetail(data) {
  return request({
    url: urlLinks.generalDetail,
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 商户查询
export function queryShopListByPage(data) {
  return request({
    url: urlLinks.queryShopListByPage,
    method: 'POST',
    data
  })
}

// 查询银行
export function queryBankPage(data) {
  return request({
    url: urlLinks.queryBankPage,
    method: 'POST',
    data
  })
}

// 查询银行
export function queryBranchPage(data) {
  return request({
    url: urlLinks.queryBranchPage,
    method: 'POST',
    data
  })
}

// 保存/编辑
export function submit(data) {
  return request({
    url: urlLinks.submit,
    method: 'POST',
    data
  })
}

// 详情
export function detail(data) {
  return request({
    url: urlLinks.detail,
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 拒绝
export function refund(data) {
  return request({
    url: urlLinks.refund,
    method: 'POST',
    data
  })
}

// 提交审核
export function submitToVerify(data) {
  return request({
    url: urlLinks.submitToVerify,
    method: 'POST',
    data
  })
}

// 经营类目
export function businessCategory(data) {
  return request({
    url: urlLinks.businessCategory,
    method: 'POST',
    data: qs.stringify(data)
  })
}
