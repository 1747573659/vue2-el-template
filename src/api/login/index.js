import request from '@/utils/request'

const urlLinks = {
  // 登陆接口
  login: '/login',
  // 获取登录用的验证码
  captcha: '/captcha',
  // 校验验证码
  validCaptcha: '/validCaptcha'
}

// 校验验证码
export function validCaptcha(data) {
  return request({
    url: urlLinks.validCaptcha,
    method: 'post',
    data: data
  })
}

// 登陆接口
export function captcha(data) {
  return request({
    url: urlLinks.captcha,
    method: 'get',
    data: data
  })
}
  
// 登陆接口
export function login(data) {
  return request({
    url: urlLinks.login,
    method: 'post',
    data: data
  })
}
