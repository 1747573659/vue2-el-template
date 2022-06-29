import request from '@/utils/request'

// 分页查询商户信息
export function queryShopPage(data) {
  return request({
    url: '/shop/queryShopListByNameAndId',
    method: 'POST',
    data
  })
}
