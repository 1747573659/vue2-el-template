import request from '@/utils/request'

const urlLinks = {
  // 登陆接口
  login: '/login',
  // 登出
  logout: '/logout',
  // 修改密码
  modifyPwd: '/modifyPwd',
  // 获取登录用的验证码
  captcha: '/captcha'
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

// 登出
export function logout(data) {
  return request({
    url: urlLinks.logout,
    method: 'get',
    data: data
  })
}

// 修改密码
export function modifyPwd(data) {
  return request({
    url: urlLinks.modifyPwd,
    method: 'post',
    data: data
  })
}
