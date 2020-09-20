import request from '@/utils/request'

const urlLinks = {
  xiaoWeiArchiveStatus: '/sms/createAuthCode',
  xiaoWeiUpgradeStatus: '/agent/modifyMobile'
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
