// 产品类型
export const productType = new Map([
  [-1, { value: -1, label: '全部' }],
  [0, { value: 0, label: 'ERP产品' }],
  [1, { value: 1, label: '微零售' }],
  [2, { value: 2, label: '微餐饮' }],
  [3, { value: 3, label: '云商' }]
])

// 订单状态
export const orderStatus = new Map([
  [-1, { value: -1, label: '全部' }],
  [10, { value: 10, label: '未提交' }],
  [20, { value: 20, label: '已提交' }],
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
