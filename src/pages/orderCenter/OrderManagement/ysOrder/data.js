export const tipsData = [
  { status: 0, label: '待付款', total: 0 },
  { status: 1, label: '待签约', total: 0 },
  { status: 3, label: '待提交发票', total: 0 }
]

// 订单状态
export const orderStatusOptions = [
  { id: -1, name: '已取消' },
  { id: 0, name: '待付款' },
  { id: 1, name: '已付款' },
  { id: 2, name: '部分退款' },
  { id: 3, name: '已退款' },
  { id: 4, name: '收款待确认' }
]
// 合同状态
export const contractStatusOptions = [
  { id: '', name: '全部' },
  { id: 0, name: '待签约' },
  { id: 1, name: '签约完成' }
]

// 服务类型
export const serviceOptions = [
  { id: '', name: '全部' },
  { id: 1, name: '版本' },
  { id: 2, name: '应用' }
]
// 购买标识
export const buyFlagOptions = [
  { id: '', name: '全部' },
  { id: 1, name: '首购' },
  { id: 3, name: '升级' },
  { id: 2, name: '续费' }
]
// 发票状态
export const invoiceOptions = [
  { id: '', name: '全部' },
  { id: -1, name: '待提交' },
  { id: 0, name: '已提交' },
  { id: 1, name: '已开票' }
]
// 发票类型
export const invoiceTypeOptions = {
  0: '普票',
  1: '专票'
}
// 发票状态
export const invoiceStatusOptions = {
  0: '待开票',
  1: '已开票'
}
