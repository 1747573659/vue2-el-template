import request from '@/utils/request'

const urlLinks = {
  queryPage: '/archive/xdd/queryPage'
}

export function queryPage(data) {
  return request({
    url: urlLinks.queryPage,
    method: 'POST',
    data
  })
}
