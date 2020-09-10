import request from '@/utils/request'

const urlLinks = {
  queryBaseInfo: '/agent/queryBaseInfo',
  modifyBaseInfo: '/agent/modifyBaseInfo',
  checkAgentName: '/agent/checkAgentName'
}
export function checkAgentName(data) {
  return request({
    url: urlLinks.checkAgentName,
    method: 'post',
    params: data
  })
}
export function queryBaseInfo(data) {
  return request({
    url: urlLinks.queryBaseInfo,
    method: 'post',
    data: data
  })
}
export function modifyBaseInfo(data) {
  return request({
    url: urlLinks.modifyBaseInfo,
    method: 'post',
    data: data
  })
}
