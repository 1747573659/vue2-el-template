const statusType = {
  0: '草稿',
  1: '未通过审核编辑中',
  2: '代理商待审核',
  3: '平台审核中',
  4: '未通过审核',
  5: '账号申请中',
  6: '账号申请部分通过',
  7: '账号申请全部通过',
  8: '资料待补充',
  9: '资料补充待审核',
  10: '账号申请中',
  11: '账号申请中'
}

export function filterReview(status) {
  // return statusType[status]
  return '1'
}
