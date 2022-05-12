import request from '@/utils/request'

// 导出记录列表查询
export function exportInventoryExportLog(data) {
  return request({
    url: '/export/log/page',
    method: 'post',
    data
  })
}

// 导出记录列表删除
export function exportInventoryDel(data) {
  return request({
    url: `/export/log/${data.id}/del`,
    method: 'post'
  })
}

// 软件库存变动流水导出记录列表
export function exportInventoryChangeWater(data) {
  return request({
    url: '/soft/inventory/exportInventoryChangeWater',
    method: 'post',
    data
  })
}

// 软件库存查询导出记录列表
export function exportInventoryTotal(data) {
  return request({
    url: '/soft/inventory/exportInventoryTotal',
    method: 'post',
    data
  })
}

export function getInventoryWaterAndSummary(data) {
  return request({
    url: '/soft/inventory/getInventoryWaterAndSummary',
    method: 'post',
    data
  })
}

export function getInventoryAndSummary(data) {
  return request({
    url: '/soft/inventory/getInventoryAndSummary',
    method: 'post',
    data
  })
}
