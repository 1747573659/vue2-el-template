export const tipsData = [
  { key: 'nearEndCount', label: '即将到期', total: 0 },
  { key: 'payUsingCount', label: '付费使用中', total: 0 },
  { key: 'testUsingCount', label: '试用中', total: 0 },
  { key: 'endCount', label: '已到期', total: 0 }
]
// 账号状态
export const accountStatusData = [
  { value: 0, label: '未试用(已开通，未试用，不含经销商开通)' },
  { value: 1, label: '试用中' },
  { value: 2, label: '试用到期' },
  { value: 3, label: '付费使用中' },
  { value: 4, label: '即将到期（不足30天）' },
  { value: 5, label: '已到期' }
]
// 当前状态
export const accountStatusEnum = {
  0: '未试用(已开通，未试用，不含经销商开通)',
  1: '试用中',
  2: '试用到期',
  3: '付费使用中',
  4: '即将到期（不足30天）',
  5: '已到期'
}
// erp产品类型
export const erpSelectList = [
  { label: '御商+', value: 'ADV10' },
  { label: '御商V9', value: 'ADV9' },
  { label: '云鼎', value: 'YD' },
  { label: '智海鲸', value: 'BLDPRO' },
  { label: '智赢+', value: 'ZY10' },
  { label: '御云', value: 'YY01' },
  { label: '御鼎', value: 'YD01' }
]

export const baseInfoItems = [
  { title: '客户名称', value: '' },
  { title: '服务到期时间', value: '' },
  { title: '渠道来源', value: '' },
  { title: '客户地址', value: '' },
  { title: 'ERP客户编码', value: '' },
  { title: '微平台商户ID', value: '' }
]
export const versionsItems = [
  { title: '版本名称', value: '' },
  { title: '期限至', value: '' },
  { title: '购买状态', value: '' },
  { title: '版本开通费用', value: '' }
]
