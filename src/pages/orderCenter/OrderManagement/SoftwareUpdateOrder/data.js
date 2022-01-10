// 订单状态
export const orderStatus = new Map([
  ['', { value: '', label: '全部' }],
  [0, { value: 0, label: '未提交', name: '编辑' }],
  [5, { value: 5, label: '未提交（被退回）', name: '编辑' }],
  [10, { value: 10, label: '待受理', name: '详情' }],
  [20, { value: 20, label: '待审核', name: '详情' }],
  [30, { value: 30, label: '已审核', name: '详情' }]
])

// 注册方式
export const oldRegistTypes = new Map([
  ['', { value: '', label: '全部' }],
  [0, { value: 0, label: '软注册' }],
  [1, { value: 1, label: '加密狗' }]
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
  upgradeAmount: '', // 升级费用
  oldRegistType: '', // 旧商户注册方式

  oldMerchantName: '', // 旧商户名称
  oldMerchantId: '', // 旧商户号
  oldMerchantAuthType: '', // 授权状态
  oldMerchantProductCode: '', // 产品编码
  oldMerchantProductCodeName: '', // 产品名称
  oldMerchantAddress: '', // 地区
  oldMerchantAuthCount: '', // 门店授权站点
  newMerchantName: '', // 新商户名称
  newMerchantId: '', // 新商户号
  newMerchantAuthType: 1, // 授权状态
  newMerchantProductCode: '', // 产品编码
  newMerchantProductCodeName: '', // 产品名称
  newMerchantAddress: '', // newAddress
  newMerchantAuthCount: '', // 门店授权站点
  agentPaperMoney: '', //经销商账面余额
  agentGuaranteeMoney: '', //经销商未核销担保金
  payStatus: 0, //付款状态
  payMethod: '',
  payTime: '', //付款时间
  payManName: '', //收款人
  useGuarantee: '', //使用担保金
  remark: '' // 原因
}
