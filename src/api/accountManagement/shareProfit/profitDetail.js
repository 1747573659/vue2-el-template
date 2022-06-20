import request from '@/utils/request'

// 经销商-行业
export function queryBenefitAccount(data) {
  return request({
    url: '/channel/account/benefit/query',
    method: 'POST',
    data
  })
}

// 分页
export function queryBenefitPage(data) {
  return request({
    url: '/channel/account/benefit/benefitPage',
    method: 'POST',
    data
  })
}

// 经销商-分润状态
export function getBenefitStatusMap(data) {
  return request({
    url: '/channel/account/benefit/getBenefitStatusMap',
    method: 'POST',
    data
  })
}
