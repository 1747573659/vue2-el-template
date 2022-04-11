import request from '@/utils/request'

const urlLinks = {
  wmdownloadExcel: `/wm/downloadExcel`,
  queryWmTermPage: `/wm/queryWmTermPage`,
  queryWmWhitePage: `/wm/queryWmWhitePage`,
  downloadWmWhiteExcel: `/wm/downloadWmWhiteExcel`
}

export function downloadWmWhiteExcel(data) {
  return request({
    url: urlLinks.downloadWmWhiteExcel,
    method: 'POST',
    data
  })
}
export function queryWmWhitePage(data) {
  return request({
    url: urlLinks.queryWmWhitePage,
    method: 'POST',
    data
  })
}
export function queryWmTermPage(data) {
  return request({
    url: urlLinks.queryWmTermPage,
    method: 'POST',
    data: data
  })
}
export function wmdownloadExcel(data) {
  return request({
    url: urlLinks.wmdownloadExcel,
    method: 'POST',
    data: data
  })
}
