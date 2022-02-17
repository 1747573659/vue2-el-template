import request from '@/utils/request'

const urlLinks = {
  detailCount: '/performance/detail/count',
  detailPage: '/performance/detail/page',
}
export function detailPage(data) {
  return request({
    url: urlLinks.detailPage,
    method: 'post',
    data
  })
}
export function detailCount(data) {
  return request({
    url: urlLinks.detailCount,
    method: 'post',
    data
  })
}
