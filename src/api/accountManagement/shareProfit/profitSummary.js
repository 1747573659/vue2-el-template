import request from '@/utils/request'

// 分页
export function queryBenefitSummaryPage(data) {
  return request({
    url: '/channel/account/benefit/benefitSummaryPage',
    method: 'POST',
    data
  })
}

// 确认更新
export function updateBenefitThirdInfo(data) {
  return request({
    url: '/channel/account/benefit/updateThirdInfo',
    method: 'POST',
    data
  })
}
