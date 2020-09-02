import request from '@/utils/request'

const urlLinks = {
  queryDocumentByPage: process.env.VUE_APP_BASE_API + '/agent/queryBaseInfo'
}

export function queryBaseInfo(data) {
  return request({
    url: urlLinks.queryBaseInfo,
    method: 'post',
    data: data
  })
}
