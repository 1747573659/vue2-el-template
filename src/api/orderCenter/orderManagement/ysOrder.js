import request from '@/utils/request'

// 列表
export function customerPayPage(data) {
  return request({
    url: '/youshu/customerpay/customerPayPage',
    method: 'POST',
    data
  })
}

// 获取数据统计
export function merchantOrderStatusStatic() {
  return request({
    url: '/youshu/customerpay/merchantOrderStatusStatic',
    method: 'GET'
  })
}
// 查询商户详情
export function getDetails(data) {
  return request({
    url: '/youshu/customerpay/getCustomerPay',
    method: 'POST',
    data
  })
}
