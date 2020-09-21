import request from '@/utils/request'

const urlLinks = {
  queryPage: '/archive/general/queryPage',
  xiaoWeiArchiveStatus: '/sms/createAuthCode',
  xiaoWeiUpgradeStatus: '/agent/modifyMobile'
}

export function queryPage(data) {
  return request({
    url: urlLinks.queryPage,
    method: 'POST',
    data
  })
}

export function xiaoWeiArchiveStatus(data) {
  return request({
    url: urlLinks.xiaoWeiArchiveStatus,
    method: 'POST',
    data
  })
}

export function xiaoWeiUpgradeStatus(data) {
  return request({
    url: urlLinks.xiaoWeiUpgradeStatus,
    method: 'POST',
    data
  })
}
