import request from '@/utils/request'
import ipConfig from '@/utils/baseUrl'
import qs from 'qs'

const urlLinks = {
  wmdownloadExcel: `/wm/downloadExcel`,
  queryWmTermPage: `/wm/queryWmTermPage`,
}
export function queryWmTermPage (data) {
  return request({
    url: urlLinks.queryWmTermPage,
    method: 'POST',
    data: data
  })
}
export function wmdownloadExcel (data) {
  return request({
    url: urlLinks.wmdownloadExcel,
    method: 'POST',
    data: data
  })
}