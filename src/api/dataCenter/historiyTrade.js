import request from '@/utils/request'

const urlLinks = {
  paymentMethodVoList: '/cashier/paymentMethodVoList',
  cashierData: '/cashier/data',
  queryAgentPage: '/agent/queryAgentPage',
  queryNewAgentPage: '/agent/queryNewAgentPage',
  queryShopListByPage: '/shop/queryShopListByNameAndId',
  queryStorePage: '/store/queryStorePage',
  detail: '/cashier/detail',
  paymentPluginVoList: '/cashier/paymentPluginVoList',
  downLoadTradeDataExcel: '/cashier/downLoadTradeDataExcel',
  downLoadTradeDetailExcel: '/cashier/downLoadTradeDetailExcel'
}
export function downLoadTradeDetailExcel(data) {
  return request({
    url: urlLinks.downLoadTradeDetailExcel,
    method: 'post',
    data
  })
}
export function downLoadTradeDataExcel(data) {
  return request({
    url: urlLinks.downLoadTradeDataExcel,
    method: 'post',
    data
  })
}
export function paymentPluginVoList(data) {
  return request({
    url: urlLinks.paymentPluginVoList,
    method: 'post',
    data
  })
}
export function paymentMethodVoList() {
  return request({
    url: urlLinks.paymentMethodVoList,
    method: 'post'
  })
}
export function cashierData(data) {
  return request({
    url: urlLinks.cashierData,
    method: 'post',
    data
  })
}
export function queryAgentPage(data) {
  return request({
    url: urlLinks.queryAgentPage,
    method: 'post',
    data
  })
}
export function queryShopListByPage(data) {
  return request({
    url: urlLinks.queryShopListByPage,
    method: 'post',
    data
  })
}
export function queryStorePage(data) {
  return request({
    url: urlLinks.queryStorePage,
    method: 'post',
    data
  })
}
export function detail(data) {
  return request({
    url: urlLinks.detail,
    method: 'post',
    data
  })
}
export function queryNewAgentPage(data) {
  return request({
    url: urlLinks.queryNewAgentPage,
    method: 'post',
    data
  })
}
