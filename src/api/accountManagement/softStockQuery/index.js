import request from '@/utils/request'

const urlLinks = {
  getInventoryAndSummary: '/soft/inventory/getInventoryAndSummary',
  getInventoryWaterAndSummary: '/soft/inventory/getInventoryWaterAndSummary'
}
export function getInventoryWaterAndSummary(data) {
  return request({
    url: urlLinks.getInventoryWaterAndSummary,
    method: 'post',
    data
  })
}
export function getInventoryAndSummary(data) {
  return request({
    url: urlLinks.getInventoryAndSummary,
    method: 'post',
    data
  })
}
