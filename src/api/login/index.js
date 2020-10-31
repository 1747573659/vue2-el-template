import request from '@/utils/request'
import qs from 'qs'

const urlLinks = {
  login: 'login',
  logout: 'logout',
  modifyPwd: 'modifyPwd',
  captcha: 'captcha',
  validCaptcha: 'validCaptcha',
  getMenuInfo: 'getMenuInfo',
  queryUser: 'user/queryUser',
  modifyUserMobile: 'user/modifyUserMobile',
  modifyUserName: 'user/modifyUserName',
  popUpsByAuditStatus: 'archive/xdd/popUpsByAuditStatus'
}

// 驳回和资料待补充状态
export function popUpsByAuditStatus(data) {
  return request({
    url: urlLinks.popUpsByAuditStatus,
    method: 'post',
    data
  })
}

// 修改用户名
export function modifyUserName(data) {
  return request({
    url: urlLinks.modifyUserName,
    method: 'post',
    data: qs.stringify(data)
  })
}

// 修改登录用户联系方式
export function modifyUserMobile(data) {
  return request({
    url: urlLinks.modifyUserMobile,
    method: 'post',
    data: data
  })
}

// 查询登录用户
export function queryUser(data) {
  return request({
    url: urlLinks.queryUser,
    method: 'post',
    data: data
  })
}

// 获取路由权限
export function getMenuInfo(data) {
  return request({
    timeout: 1000,
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
