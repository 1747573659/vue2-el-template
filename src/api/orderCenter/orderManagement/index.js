import request from '@/utils/request'
import qs from 'qs'

// 采购订单 行业信息
export function queryIndustryInfo(data) {
  return request({
    url: '/channel/purchase/industryInfo',
    method: 'POST',
    data
  })
}

// 分页获取订单
export function queryByPage(data) {
  return request({
    url: '/channel/purchase/queryByPage',
    method: 'POST',
    data
  })
}

// 下单人接口
export function queryAgentAllUser(data) {
  return request({
    url: '/employeeUser/queryAgentAllUser',
    method: 'POST',
    data
  })
}

// 导出
export function exportOrder(data) {
  return request({
    url: '/channel/purchase/exportOrder',
    method: 'POST',
    data
  })
}

// 导出记录
export function exportRecordList(data) {
  return request({
    url: '/channel/purchase/exportRecordList',
    method: 'POST',
    data
  })
}

// 删除导出记录
export function deleteExport(data) {
  return request({
    url: '/channel/purchase/deleteExport',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 经销商收货地址
export function queryById(data) {
  return request({
    url: '/channel/address/queryById',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 设置经销商默认收货地址
export function updateUsage(data) {
  return request({
    url: '/channel/address/updateUsage',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 删除收货地址
export function deleteAddress(data) {
  return request({
    url: '/channel/address/delete',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 获取代理商基本信息
export function queryBaseInfo() {
  return request({
    url: '/agent/queryBaseInfo',
    method: 'POST'
  })
}

// 产品列表
export function productInfo(data) {
  return request({
    url: '/channel/purchase/productInfo',
    method: 'POST',
    data
  })
}

// 获取当前经销商的
export function queryAgentMoneyStream(data) {
  return request({
    url: '/channel/purchase/queryAgentMoneyStream',
    method: 'POST',
    data
  })
}

// 查询受理人
export function queryHandlerMan(data) {
  return request({
    url: '/channel/purchase/queryHandlerMan',
    method: 'POST',
    data
  })
}

// 新增
export function purchaseAdd(data) {
  return request({
    url: '/channel/purchase/add',
    method: 'POST',
    data
  })
}

// 采购订单详情
export function purchaseQueryById(data) {
  return request({
    url: '/channel/purchase/queryById',
    method: 'POST',
    data
  })
}

// 提交
export function purchaseSubmit(data) {
  return request({
    url: '/channel/purchase/submit',
    method: 'POST',
    data
  })
}

// 修改
export function purchaseUpdate(data) {
  return request({
    url: '/channel/purchase/update',
    method: 'POST',
    data
  })
}

// 修改
export function operateLog(data) {
  return request({
    url: '/channel/purchase/operateLog',
    method: 'POST',
    data
  })
}

// 删除
export function deleteById(data) {
  return request({
    url: '/channel/purchase/deleteById',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 确认收货
export function confirmGoods(data) {
  return request({
    url: '/channel/purchase/confirmGoods',
    method: 'POST',
    data: qs.stringify(data)
  })
}
