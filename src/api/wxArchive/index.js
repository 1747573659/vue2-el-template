import request from '@/utils/request'
import qs from 'qs'

const urlLinks = {
  queryPage: 'archive/general/queryPage',
  xiaoWeiArchiveStatus: 'archive/general/xiaoWeiArchiveStatus',
  xiaoWeiUpgradeStatus: 'archive/general/xiaoWeiUpgradeStatus',
  generalStopUse: 'archive/general/stopUse',
  generalDetail: 'archive/general/generalDetail',
  queryShopListByPage: 'shop/queryShopListByPage',
  queryBankPage: 'branch/queryBankPage',
  submit: 'archive/general/submit',
  detail: 'archive/general/detail',
  refund: 'archive/general/refund',
  submitToVerify: 'archive/general/submitToVerify'
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

// 商户查询
export function queryBankPage(data) {
  return request({
    url: urlLinks.queryBankPage,
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
