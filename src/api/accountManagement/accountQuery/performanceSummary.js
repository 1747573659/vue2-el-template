import request from '@/utils/request'

// 分页列表
export function queryByPage(data) {
  return request({
    url: '/performance/summary/page',
    method: 'POST',
    data
  })
}
