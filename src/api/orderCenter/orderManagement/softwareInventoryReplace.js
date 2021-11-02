import request from '@/utils/request'
import qs from 'qs'

// 分页获取软件库存置换单
export function queryByPage(data) {
  return request({
    url: '/replace/order/page',
    method: 'POST',
    data
  })
}

// 导出
export function replaceOrderExport(data) {
  return request({
    url: '/replace/order/export/' + data.menu,
    method: 'POST',
    data: data.params
  })
}

// 导出记录
export function replaceOrderExportLog(data) {
  return request({
    url: '/export/log/page',
    method: 'POST',
    data
  })
}

// 导出删除
export function replaceOrderExportDel(data) {
  return request({
    url: '/export/log/' + data + '/del',
    method: 'POST'
  })
}

// 详情
export function replaceOrderDetail(data) {
  return request({
    url: '/replace/order/' + data,
    method: 'POST'
  })
}

// 产品信息-置换规则中所有原产品分页
export function replaceOrderProduct(data) {
  return request({
    url: '/replace/order/pageForProduct',
    method: 'POST',
    data
  })
}

// 获取置换产品信息-根据原产品编码查询
export function replaceOrderOriginalProduct(data) {
  return request({
    url: '/replace/order/listByOriginalProductCode/' + data,
    method: 'POST'
  })
}

// 查询库存
export function queryByAgentProduct(data) {
  return request({
    url: '/soft/inventory/queryByAgentProduct',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 新增
export function replaceOrderAdd(data) {
  return request({
    url: '/replace/order/add',
    method: 'POST',
    data
  })
}

// 更新
export function replaceOrderUpdate(data, status) {
  return request({
    url: '/replace/order/update/' + status,
    method: 'POST',
    data
  })
}

// 删除
export function replaceOrderDelete(data) {
  return request({
    url: '/replace/order/del/' + data,
    method: 'POST'
  })
}

// 删除
export function replaceOrderSubmit(data) {
  return request({
    url: '/replace/order/submit',
    method: 'POST',
    data
  })
}

// 操作日志
export function authOrderLog(data) {
  return request({
    url: '/auth/order/log/' + data,
    method: 'POST'
  })
}
