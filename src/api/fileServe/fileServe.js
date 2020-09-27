import request from '@/utils/request'

const urlLinks = {
  fileServer: '/fileServer',
  ossFileServer: '/oss/fileServer',
}

export function fileServer(data) {
  return request({
    url: urlLinks.fileServer,
    method: 'post',
    params: data
  })
}

// 获取文件服务器地址（oss非进件资料使用）
export function ossFileServer() {
  return request({
    url: urlLinks.ossFileServer,
    method: 'post'
  })
}
