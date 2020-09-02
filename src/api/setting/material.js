import request from '@/utils/request'

const urlLinks = {
  queryDocumentByPage: '/document/queryDocumentByPage'
}

export function queryDocumentByPage(data) {
  return request({
    url: urlLinks.queryDocumentByPage,
    method: 'post',
    data: data
  })
}
