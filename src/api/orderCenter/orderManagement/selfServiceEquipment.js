import request from '@/utils/request'

// 分页列表-自助设备授权订单
export function queryOrderSelfPage(data) {
  return request({
    url: '/channel/order/self/page',
    method: 'POST',
    data
  })
}
