import request from '@/utils/request'

const urlLinks = {
  productQueryByPage: '/product/queryByPage',
  productQueryTypeList: '/product/queryTypeList'
}
export function productQueryTypeList(data) {
  return request({
    url: urlLinks.productQueryTypeList,
    method: 'post',
    data
  })
}
export function productQueryByPage(data) {
  return request({
    url: urlLinks.productQueryByPage,
    method: 'post',
    data
  })
}
