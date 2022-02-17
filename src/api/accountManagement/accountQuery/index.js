import request from '@/utils/request'

const urlLinks = {
  changePage: '/channel/agent/change/page',
  changeSumPage: '/channel/agent/change/sumPage'
}
export function changeSumPage(data) {
  return request({
    url: urlLinks.changeSumPage,
    method: 'post',
    data
  })
}
export function changePage(data) {
  return request({
    url: urlLinks.changePage,
    method: 'post',
    data
  })
}
