// 订单状态
export const orderStatus = new Map([
  ['', { value: '', label: '全部' }],
  [0, { value: 0, label: '未提交', name: '编辑' }],
  [5, { value: 5, label: '未提交（被退回）', name: '编辑' }],
  [10, { value: 10, label: '待审核', name: '详情' }],
  [20, { value: 20, label: '已审核', name: '详情' }]
])

export const formObj = {
  orderDTO: {
    billNo: '', // 订单编码
    createTime: '', // 订单时间
    useInventory: '', // 消耗库存
    handlerUser: '',
    handlerUserName: '', // 受理人名称
    agentId: '', // 经销商id
    agentName: '' // 经销商名称
  },
  orderDetailDtos: []
}
