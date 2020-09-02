import request from '@/utils/request'

const urlLinks = {
  queryDocumentByPage: process.env.VUE_APP_BASE_API + '/document/queryDocumentByPage'
}

export function queryDocumentByPage(data) {
  return request({
    url: urlLinks.queryDocumentByPage,
    method: 'post',
    data: data
  })
}
