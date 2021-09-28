// 产品类型
export const productType = new Map([
  [-1, { value: -1, label: '全部' }],
  [0, { value: 0, label: 'ERP产品' }],
  [5, { value: 5, label: '微零售' }],
  [10, { value: 10, label: '微餐饮' }],
  [20, { value: 20, label: '云商' }]
])

// 订单状态
export const orderStatus = new Map([
  [-1, { value: -1, label: '全部' }],
  [0, { value: 0, label: '未提交' }],
  [1, { value: 1, label: '已提交' }],
  [2, { value: 2, label: '已审核' }]
])
