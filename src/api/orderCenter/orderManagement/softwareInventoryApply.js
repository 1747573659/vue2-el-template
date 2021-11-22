import request from '@/utils/request'
import qs from 'qs'

// 分页获取软件库存申请单
export function queryByPage(data) {
  return request({
    url: '/inventory/apply/page',
    method: 'POST',
    data
  })
}

// 软件库存申请单删除
export function applyOrderDelete(data) {
  return request({
    url: '/inventory/apply/delete/' + data,
    method: 'POST'
  })
}

// 导出1
export function applyExportExcelLevelOne(data) {
  return request({
    url: '/inventory/apply/exportExcelLevelOne',
    method: 'POST',
    data
  })
}

// 导出2
export function applyExportExcelLevelTwo(data) {
  return request({
    url: '/inventory/apply/exportExcelLevelTwo',
    method: 'POST',
    data
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

// 软件库存申请单新增
export function applyOrderAdd(data) {
  return request({
    url: '/inventory/apply/add',
    method: 'POST',
    data
  })
}

// 软件库存申请单新增
export function applyOrderUpdate(data) {
  return request({
    url: '/inventory/apply/update',
    method: 'POST',
    data
  })
}

// 软件库存申请单详情
export function applyOrderDetail(data) {
  return request({
    url: '/inventory/apply/detail/' + data,
    method: 'POST'
  })
}
