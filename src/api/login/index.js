import request from '@/utils/request'

const urlLinks = {
  verifyCode: 'https://api.auauz.net/auth/code',
  login: 'https://sm-api.cs.kemai.com.cn/login'
}

export function login(data) {
  return request({
    url: urlLinks.login,
    method: 'post',
    data
  })
}

export function getVerifyCode(params) {
  return request({
    url: urlLinks.verifyCode,
    method: 'get',
    params
  })
}
