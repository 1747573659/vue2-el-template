import request from '@/utils/request'

const urlLinks = {
  queryBaseInfo: '/agent/queryBaseInfo',
  modifyBaseInfo: '/agent/modifyBaseInfo'
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
