import request from '@/utils/request'

const urlLinks = {
  createAuthCode: '/sms/createAuthCode',
  modifyMobile: '/agent/modifyMobile'
}

export function createAuthCode(data) {
  return request({
    url: urlLinks.createAuthCode,
    method: 'post',
    params: data
  })
}
export function modifyMobile(data) {
  return request({
    url: urlLinks.modifyMobile,
    method: 'post',
    params: data
  })
}
