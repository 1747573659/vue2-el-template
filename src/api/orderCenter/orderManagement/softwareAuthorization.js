import request from '@/utils/request'
import qs from 'qs'

// 分页列表-授权订单列表
export function queryByPage(data) {
  return request({
    url: '/auth/order/page',
    method: 'POST',
    data
  })
}

// 导出
export function authOrderExport(data) {
  return request({
    url: '/replace/order/export/' + data.menu,
    method: 'POST',
    data: data.params
  })
}

// 导出记录
export function authOrderExportLog(data) {
  return request({
    url: '/export/log/page',
    method: 'POST',
    data
  })
}

// 导出删除
export function authOrderExportDel(data) {
  return request({
    url: '/export/log/' + data + '/del',
    method: 'POST'
  })
}

export function queryProducts(data) {
  return request({
    baseURL: 'http://127.0.0.1:4523/mock/432806',
    url: '/channel/author/licensed/products',
    method: 'POST',
    data
  })
}
