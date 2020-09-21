import request from '@/utils/request'
import ipConfig from '@/utils/baseUrl'
import qs from 'qs'

const urlLinks = {
  queryAllConditionByType: `${ipConfig.COMMON_API}/summarySettle/queryAllConditionByType`,
  queryStorePage: `${ipConfig.COMMON_API}/storeManage/queryStorePage`,
  queryMerchantAdminPage: `${ipConfig.COMMON_API}/shopManager/queryMerchantAdminPage`,
  queryPaySceneByType: `${ipConfig.COMMON_API}/summarySettle/queryPaySceneByType`,
  querySummary: `${ipConfig.COMMON_API}/summarySettle/querySummary`,
  queryAllTradeStatus: `${ipConfig.COMMON_API}/shopOrder/queryAllTradeStatus`,
  queryMerchantOrderPage: `${ipConfig.COMMON_API}/shopOrder/queryPage`,
  downloadExcel: `${ipConfig.COMMON_API}/shopOrder/downloadExcel`,
  deleteRecord: `${ipConfig.COMMON_API}/shopOrder/deleteRecord`,
  queryExportRecord: `${ipConfig.COMMON_API}/shopOrder/queryExportRecord`,
  detail: `${ipConfig.COMMON_API}/shopOrder/detail`,
  querySingleOrder: `${ipConfig.COMMON_API}/singleOrder/querySingleOrder`,
  refundOrderQueryPage: `${ipConfig.COMMON_API}/refundOrder/queryPage`,
  refundOrderdetail: `${ipConfig.COMMON_API}/refundOrder/detail`
}

const queryAllCondition = data => {
  return request({
    url: urlLinks.queryAllConditionByType,
    method: 'POST',
    data: qs.stringify(data)
  })
}
const queryStorePage = data => {
  return request({
    url: urlLinks.queryStorePage,
    method: 'POST',
    data: data
  })
}
const queryMerchantAdminPage = data => {
  return request({
    url: urlLinks.queryMerchantAdminPage,
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
    params: data
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
  queryExportRecord
}
