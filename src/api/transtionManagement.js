import request from '@/utils/request'
import ipConfig from '@/utils/baseUrl'
import qs from 'qs'

const urlLinks = {
  queryAllConditionByType: `/shopOrder/queryAllConditionByType`,
  queryStorePage: `/storeClerkManager/queryStorePageByShop`,
  queryMerchantAdminPage: `/shop/queryShopListByPage`,
  queryClerkPageByStore: `/storeClerkManager/queryClerkPageByStore`,
  queryPaySceneByType: `/shopOrder/queryPaySceneByType`,
  querySummary: `/shopOrder/querySummary`,
  queryAllTradeStatus: `/shopOrder/queryAllTradeStatus`,
  queryMerchantOrderPage: `/shopOrder/queryPage`,
  downloadExcel: `/shopOrder/downloadExcel`,
  deleteRecord: `/shopOrder/deleteRecord`,
  queryExportRecord: `/shopOrder/queryExportRecord`,
  detail: `/shopOrder/detail`,
  querySingleOrder: `/singleOrder/querySingleOrder`,
  refundOrderQueryPage: `/refundOrder/queryPage`,
  refundOrderdetail: `/refundOrder/detail`,
  wmdownloadExcel: `/wm/downloadExcel`,
  queryWmTermPage: `/wm/queryWmTermPage`,
}

const queryAllCondition = data => {
  return request({
    url: urlLinks.queryAllConditionByType,
    method: 'POST',
    data: qs.stringify(data)
  })
}
//查询门店
const queryStorePage = data => {
  return request({
    url: urlLinks.queryStorePage,
    method: 'POST',
    data: data
  })
}

//查询商户
const queryMerchantAdminPage = data => {
  return request({
    url: urlLinks.queryMerchantAdminPage,
    method: 'POST',
    data: data
  })
}
//查询收营员
const queryClerkPageByStore = data => {
  return request({
    url: urlLinks.queryClerkPageByStore,
    method: 'POST',
    data: data
  })
}

const queryPaySceneByType = data => {
  return request({
    url: urlLinks.queryPaySceneByType,
    method: 'POST',
    data: qs.stringify(data)
  })
}

const querySummary = data => {
  return request({
    url: urlLinks.querySummary,
    method: 'POST',
    data: data
  })
}

const queryAllTradeStatus = data => {
  return request({
    url: urlLinks.queryAllTradeStatus,
    method: 'POST',
    data: data
  })
}

const queryMerchantOrderPage = data => {
  return request({
    url: urlLinks.queryMerchantOrderPage,
    method: 'POST',
    data: data
  })
}

const downloadExcel = data => {
  return request({
    url: urlLinks.downloadExcel,
    method: 'POST',
    data: data
  })
}

const queryExportRecord = data => {
  return request({
    url: urlLinks.queryExportRecord,
    method: 'POST',
    data: data
  })
}

export function deleteRecord (data) {
  return request({
    url: urlLinks.deleteRecord,
    method: 'POST',
    params: data
  })
}

export function detail (data) {
  return request({
    url: urlLinks.detail,
    method: 'POST',
    params: data
  })
}

export function refundOrderdetail (data) {
  return request({
    url: urlLinks.refundOrderdetail,
    method: 'POST',
    isOld:true,
    data: qs.stringify(data)
  })
}

export function querySingleOrder (data) {
  return request({
    url: urlLinks.querySingleOrder,
    method: 'POST',
    data: data
  })
}

export function refundOrderQueryPage (data) {
  return request({
    url: urlLinks.refundOrderQueryPage,
    method: 'POST',
    data: data
  })
}

export {
  queryAllCondition,
  queryStorePage,
  queryMerchantAdminPage,
  queryPaySceneByType,
  querySummary,
  queryAllTradeStatus,
  queryMerchantOrderPage,
  downloadExcel,
  queryExportRecord,
  queryClerkPageByStore
}
