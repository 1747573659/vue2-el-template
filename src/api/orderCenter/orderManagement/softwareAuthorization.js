import request from '@/utils/request'
import qs from 'qs'

// 分页获取软件库存置换单
export function queryByPage(data) {
  return request({
    baseURL: 'http://127.0.0.1:4523/mock/432806',
    url: '/channel/author/queryByPage',
    method: 'POST',
    data
  })
}
