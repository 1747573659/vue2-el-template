import request from '@/utils/request/request'

export function login (data) {
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}