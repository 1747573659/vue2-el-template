import request from '@/utils/request'

// 列表
export function queryByPage(data) {
  return request({
    url: '/youshu/merchant/queryByPage',
    method: 'POST',
    data
  })
}

// 获取当前版本
export function queryCustomerVersion() {
  return request({
    url: '/youshu/merchant/queryVersion',
    method: 'GET'
  })
}
// 获取数据统计
export function queryVersionStatic() {
  return request({
    url: '/youshu/merchant/queryVersionStatic',
    method: 'GET'
  })
}
// 查询商户详情
export function getDetails(data) {
  return request({
    url: '/youshu/merchant/getVersion',
    method: 'POST',
    data
  })
}

// 获取经销商列表
export function queryAgents() {
  return request({
    url: '/youshu/merchant/queryAgents',
    method: 'GET'
  })
}
