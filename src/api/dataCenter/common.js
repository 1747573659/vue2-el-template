import request from '@/utils/request'

const urlLinks = {
  // 分页角色列表
  uploadimage: '/JFService/KMJFService.asmx/uploadimage'
}
// 校验角色重名
export function uploadimage(data) {
  return request({
    url: urlLinks.uploadimage,
    method: 'post',
    params: data
  })
}
