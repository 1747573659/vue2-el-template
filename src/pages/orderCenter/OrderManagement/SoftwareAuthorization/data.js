// 产品类型
export const productType = new Map([
  [-1, { value: -1, label: '全部' }],
  [1, { value: 1, label: 'ERP产品' }],
  [3, { value: 3, label: '微零售' }],
  [4, { value: 4, label: '微餐饮' }],
  [5, { value: 5, label: '云商' }]
])

// 订单状态
export const orderStatus = new Map([
  [-1, { value: -1, label: '全部' }],
  [0, { value: 0, label: '未提交' }],
  [5, { value: 5, label: '未提交（被退回）' }],
  [10, { value: 10, label: '未提交' }],
  [20, { value: 20, label: '待审核' }],
  [40, { value: 40, label: '已审核' }]
])


// 订单状态
export const delayTimes = [
  { value: 0, label: '1年' },
  { value: 1, label: '2年' },
  { value: 2, label: '3年' },
]

export const formObj = {
  purchaseOrderDTO: {
    billNo: '', // 单据编码
    createOrderTime: '',
    handUser: '', // 受理人id
    handUserName: '', // 受理人名称
    agentId: '', // 经销商id
    agentName: '' // 经销商名称
  },
  orderItemList: []
}
