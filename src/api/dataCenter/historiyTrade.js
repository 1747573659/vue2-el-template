import request from '@/utils/request'

const urlLinks = {
  paymentMethodVoList: '/cashier/paymentMethodVoList',
  cashierData: '/cashier/data',
  queryAgentPage: '/agent/queryAgentPage',
  queryNewAgentPage: '/agent/queryNewAgentPage',
  queryShopListByPage: '/shop/queryShopListByPage',
  queryStorePage: '/store/queryStorePage',
  detail: '/cashier/detail'
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
