import request from '@/utils/request'

const urlLinks = {
  fileServer: '/fileServer'
}

export function fileServer(data) {
  return request({
    url: urlLinks.fileServer,
    method: 'post',
    params: data
  })
}
