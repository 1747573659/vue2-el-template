// 订单状态
export const orderStatus = new Map([
  [-1, { value: -1, label: '全部' }],
  [0, { value: 0, label: '未提交', name: '编辑' }],
  [5, { value: 5, label: '未提交（被退回）', name: '编辑' }],
  [10, { value: 10, label: '未提交', name: '编辑' }],
  [20, { value: 20, label: '待受理', name: '详情' }],
  [30, { value: 30, label: '待审核', name: '详情' }],
  [40, { value: 40, label: '已审核', name: '详情' }]
])

// 付款状态
export const paymentStatus = new Map([
  [-1, { value: -1, label: '全部' }],
  [0, { value: 0, label: '未付款' }],
  [1, { value: 1, label: '部分付款' }],
  [2, { value: 2, label: '已付款' }]
])

// 发货状态
export const deliveryStatus = new Map([
  [-1, { value: -1, label: '全部' }],
  [10, { value: 10, label: '待发货' }],
  [20, { value: 20, label: '待收货' }],
  [30, { value: 30, label: '已收货' }],
  [0, { value: 0, label: '无需发货' }]
])

export const formObj = {
  from: false,
  purchaseOrderDTO: {
    billNo: '', // 订单编码
    createOrderTime: '',
    orderAmount: 0, // 订单金额
    handUser: '', // 受理人id
    handUserName: '', // 受理人名称
    // 收货信息
    receivePeople: '', // 收货人
    receivePeoplePhone: '', // 收货人电话
    area: '', // 所在地区
    city: '',
    province: '',
    address: '', // 详细地址
    // 账款信息
    agentPaperMoney: '', // 账面余额
    agentGuaranteeMoney: '', // 未核销担保金
    payStatus: '', // 付款状态
    payTime: '', // 付款时间
    payMethod: '', // 付款方式
    receiveMoneyPeople: '', // 收款人
    useGuarantee: '', // 使用担保金
    agentId: '', // 经销商id
    agentName: '', // 经销商名称
    // 快递信息
    deliverStatus: '', // 发货状态
    deliverTime: '', // 发货时间
    expressNo: '', // 快递单号
    receiveGoodStatus: '', // 收货状态
    couponStatus: -1
  },
  orderItemList: []
}
