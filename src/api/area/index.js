import request from '@/utils/request'

const urlLinks = {
  queryProvinceList: '/district/queryProvinceList',
  queryCityList: '/district/queryCityList'
}

export function queryProvinceList(data) {
  return request({
    url: urlLinks.queryProvinceList,
    method: 'post',
    params: data
  })
}
export function queryCityList(data) {
  return request({
    url: urlLinks.queryCityList,
    method: 'post',
    data: data
  })
}
