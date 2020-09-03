import request from '@/utils/request'

const urlLinks = {
  // 登陆接口
  login: '/login',
  // 登出
  logout: '/logout',
  // 修改密码
  modifyPwd: '/modifyPwd',
  // 获取登录用的验证码
  captcha: '/captcha',
  // 校验验证码
  validCaptcha: '/validCaptcha',
  //
  getMenuInfo: '/getMenuInfo'
}
// 获取路由权限
export function getMenuInfo(data) {
  return request({
    url: urlLinks.getMenuInfo,
    method: 'post',
    data: data
  })
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
    data
  })
}

// 登出
export function logout(params) {
  return request({
    url: urlLinks.logout,
    method: 'get',
    params
  })
}

// 修改密码
export function modifyPwd(data) {
  return request({
    url: urlLinks.modifyPwd,
    method: 'post',
    data
  })
}
