export const statusOptions = [
  { value: '', label: '全部', hidden: false },
  { value: 0, label: '草稿', hidden: false },
  { value: 1, label: '未通过审核编辑中', hidden: false },
  { value: 2, label: '代理商待审核', hidden: false },
  { value: 3, label: '平台审核中', hidden: false },
  { value: 4, label: '未通过审核', hidden: false },
  { value: 5, label: '账号申请中', hidden: false },
  { value: 6, label: '账号申请部分通过', hidden: false },
  { value: 7, label: '账号申请全部通过', hidden: false },
  { value: 8, label: '资料待补充', hidden: false },
  { value: 9, label: '资料补充待审核', hidden: false },
  { value: 10, label: '账号申请中', hidden: true },
  { value: 11, label: '账号申请中', hidden: true }
]

export const deactivateOptions = [
  { value: 0, label: '否' },
  { value: 1, label: '是' }
]

export const detailOptions = [
  { value: -1, label: '驳回' },
  { value: 1, label: '待审核' },
  { value: 2, label: '审核中' },
  { value: 3, label: '待签约' },
  { value: 4, label: '签约完成' }
]
