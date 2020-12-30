import request from '@/utils/request'

const urlLinks = {
  createAuthCode: '/sms/createAuthCode',
  modifyMobile: '/agent/modifyMobile',
  shopModifyMobile: '/shop/modifyMobile'
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
export function shopModifyMobile(data) {
  return request({
    url: urlLinks.shopModifyMobile,
    method: 'post',
    params: data
  })
}
