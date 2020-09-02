import request from '@/utils/request'

const urlLinks = {
  // 登陆接口
  login: process.env.VUE_APP_BASE_API + '/login',
  // 获取登录用的验证码
  captcha: process.env.VUE_APP_BASE_API + '/captcha'
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
