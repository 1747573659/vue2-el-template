import request from '@/utils/request'

// import axios from 'axios'
// axios.config.baseURL = 'http://127.0.0.1:4523/mock/526932'

// 分页列表
export function queryByPage(data) {
  return request({
    url: 'http://127.0.0.1:4523/mock/526932/performance/summary/page',
    method: 'POST',
    data
  })
}
