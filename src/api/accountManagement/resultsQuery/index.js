import request from '@/utils/request'

export function querySubIndustry(data) {
  return request({
    url: '/performance/detail/querySubIndustry',
    method: 'post',
    data
  })
}

export function detailPage(data) {
  return request({
    url: '/performance/detail/page',
    method: 'post',
    data
  })
}

export function detailCount(data) {
  return request({
    url: '/performance/detail/count',
    method: 'post',
    data
  })
}
