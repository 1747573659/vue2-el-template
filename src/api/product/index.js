import request from '@/utils/request'

const urlLinks = {
    productQueryByPage: '/product/queryByPage',
}
export function productQueryByPage(data) {
  return request({
    url: urlLinks.productQueryByPage,
    method: 'post',
    data
  })
}