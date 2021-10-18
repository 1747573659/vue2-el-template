// 订单状态
export const orderStatus = new Map([
  ['', { value: '', label: '全部'}],
  [0, { value: 0, label: '未提交' }],
  [5, { value: 5, label: '未提交（被退回）' }],
  [10, { value: 10, label: '未提交' }],
  [20, { value: 20, label: '待审核' }],
  [30, { value: 30, label: '已审核' }]
])

export const formObj = {
  orderDTO: {
    billNo: '', // 单据编码
    createTime: '', // 订单时间
    useInventory: '', // 消耗库存
    handUserName: '', // 受理人名称
    agentId: '', // 经销商id
    agentName: '', // 经销商名称
    upgradeFee: '', // 升级费用
  },
  orderDetailDtos: []
}
