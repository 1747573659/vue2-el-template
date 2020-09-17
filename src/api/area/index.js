import request from '@/utils/request'

const urlLinks = {
  queryProvinceList: '/district/queryProvinceList'
}

export function queryProvinceList(data) {
  return request({
    url: urlLinks.queryProvinceList,
    method: 'post',
    params: data
  })
}
