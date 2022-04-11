// 产品类型
export const industryTypes = new Map([
  ['', { value: '', label: '全部' }],
  [1, { value: 1, label: '零售' }],
  [2, { value: 2, label: '餐饮' }],
  [3, { value: 3, label: '专卖' }]
])

// 订单状态
export const orderStatus = new Map([
  ['', { value: '', label: '全部' }],
  [0, { value: 0, label: '未提交', name: '编辑' }],
  [5, { value: 5, label: '未提交（被退回）', name: '编辑' }],
  [10, { value: 10, label: '待受理', name: '详情' }],
  [20, { value: 20, label: '待审核', name: '详情' }],
  [30, { value: 30, label: '已审核', name: '详情' }]
])

// 付款状态
export const paymentStatus = new Map([
  ['', { value: '', label: '全部' }],
  [0, { value: 0, label: '未付款' }],
  [2, { value: 2, label: '已付款' }]
])

// form 基础对象
export const formObj = {
  id: '',
  billNo: '', // 订单编码
  createOrderTime: '', // 订单时间
  handUser: '', // 受理人
  handUserName: '', // 受理人名称
  productCode: '', // 产品编码
  productCodeName: '', // 产品名称
  developDay: '', // 开发人天
  developAmount: '', // 开发费用
  agentPaperMoney: '', // 经销商账面余额
  agentGuaranteeMoney: '', // 经销商未核销担保金
  payStatus: 0, // 付款状态
  payMethod: '', // 付款方式
  payTime: '', // 付款时间
  payManName: '', // 收款人
  useGuarantee: '', // 使用担保金
  remark: '' // 原因
}
