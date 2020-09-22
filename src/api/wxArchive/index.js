import request from '@/utils/request'

const urlLinks = {
  queryPage: 'archive/general/queryPage',
  xiaoWeiArchiveStatus: 'archive/general/xiaoWeiArchiveStatus',
  xiaoWeiUpgradeStatus: 'archive/general/xiaoWeiUpgradeStatus',
  generalEnable: 'archive/general/enable',
  generalDetail: 'archive/general/generalDetail'
}

// 分页查询
export function queryPage(data) {
  return request({
    url: urlLinks.queryPage,
    method: 'POST',
    data
  })
}
// 小微进件状态列表
export function xiaoWeiArchiveStatus(data) {
  return request({
    url: urlLinks.xiaoWeiArchiveStatus,
    method: 'POST',
    data
  })
}
// 小微升级状态列表
export function xiaoWeiUpgradeStatus(data) {
  return request({
    url: urlLinks.xiaoWeiUpgradeStatus,
    method: 'POST',
    data
  })
}

// 启用/停用
export function generalEnable(data) {
  return request({
    url: urlLinks.generalEnable,
    method: 'POST',
    data
  })
}

// 进件详情
export function generalDetail(data) {
  return request({
    url: urlLinks.generalDetail,
    method: 'POST',
    data
  })
}
