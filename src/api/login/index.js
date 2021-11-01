import request from '@/utils/request'
import qs from 'qs'

const urlLinks = {
  login: 'login',
  logout: 'logout',
  modifyPwd: 'modifyPwd',
  getMenuInfo: 'getMenuInfo',
  queryUser: 'user/queryUser',
  modifyUserMobile: 'user/modifyUserMobile',
  modifyUserName: 'user/modifyUserName',
  popUpsByAuditStatus: 'archive/xdd/popUpsByAuditStatus',
  initImg: '/initImg',
  checkSliderImg: '/checkSliderImg',
  queryBackgroundById: '/loginBackground/queryBackgroundById',
}
// 根据应用系统ID查询图片调用地址
export function queryBackgroundById(data) {
  return request({
    url: urlLinks.queryBackgroundById,
    method: 'post',
    data: qs.stringify(data)
  })
}
// 滑动验证码-获取图形验证码
export function initImg(data) {
  return request({
    url: urlLinks.initImg,
    method: 'post',
    data: qs.stringify(data)
  })
}

// 滑动验证码-图形验证码验证结果
export function checkSliderImg(data) {
  return request({
    url: urlLinks.checkSliderImg,
    method: 'post',
    data: qs.stringify(data)
  })
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
    params: data
  })
}

// 修改登录用户联系方式
export function modifyUserMobile(data) {
  return request({
    url: urlLinks.modifyUserMobile,
    method: 'post',
    data: qs.stringify(data)
  })
}

// 查询登录用户
export function queryUser(data) {
  return request({
    url: urlLinks.queryUser,
    method: 'post',
    data: qs.stringify(data)
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

// 获取代理商基本信息
export function queryBaseInfo() {
  return request({
    url: '/agent/queryBaseInfo',
    method: 'POST'
  })
}