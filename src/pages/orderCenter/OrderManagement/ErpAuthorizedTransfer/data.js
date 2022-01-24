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

// form 基础对象
export const formObj = {
  id: '',
  billNo: '', // 订单编码
  createOrderTime: '', // 订单时间
  handUser: '', // 受理人
  handUserName: '', // 受理人名称
  oldRegistType: 0, // 旧商户注册方式
  oldMerchantName: '', // 旧商户名称
  oldMerchantId: '', // 旧商户号
  oldMerchantAuthType: '', // 授权状态
  oldMerchantProductCode: '', // 产品编码
  oldMerchantProductCodeName: '', // 产品名称
  oldAddress: '', // 地区
  oldMerchantAuthCount: '', // 门店授权站点
  newMerchantName: '', // 新商户名称
  newMerchantId: '', // 新商户号
  newMerchantAuthType: '', // 授权状态
  newMerchantProductCode: '', // 产品编码
  newMerchantProductCodeName: '', // 产品名称
  newAddress: '', // 地区
  newMerchantAuthCount: '', // 门店授权站点
  remark: '' // 原因
}
