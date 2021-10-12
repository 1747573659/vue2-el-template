// 订单状态
export const orderStatus = new Map([
  [-1, { value: -1, label: '全部' }],
  [10, { value: 10, label: '未提交' }],
  [20, { value: 20, label: '待审核' }],
  [40, { value: 40, label: '已审核' }]
])

export const formObj = {
  purchaseOrderDTO: {
    billNo: '', // 单据编码
    createOrderTime: '',
    consumeInventory: '', // 订单金额
    handUser: '', // 受理人id
    handUserName: '', // 受理人名称
    agentId: '', // 经销商id
    agentName: '' // 经销商名称
  },
  orderItemList: []
}
