// 产品类型
export const productType = new Map([
  ['', { value: '', label: '全部' }],
  [1, { value: 1, label: 'ERP产品' }],
  [3, { value: 3, label: '微零售' }],
  [4, { value: 4, label: '微餐饮' }],
  [5, { value: 5, label: '云商' }],
  [6, { value: 6, label: '加密狗' }]
])

// 订单状态
export const orderStatus = new Map([
  ['', { value: '', label: '全部' }],
  [0, { value: 0, label: '未提交', name: '编辑' }],
  [5, { value: 5, label: '未提交（被退回）', name: '编辑' }],
  [10, { value: 10, label: '待审核', name: '详情' }],
  [20, { value: 20, label: '已审核', name: '详情' }]
])

// 订单状态
export const delayTimes = [
  { value: 1, label: '1年' }
]

export const formErpObj = {
  authOrderDTO: {
    billNo: '', // 单据编码
    createOrderTime: '',
    inventoryAmount: '', // 受理人id
    handManName: '' // 受理人名称
  },
  erpAuthMerchantDTO: {
    agentId: '',
    agentName: '',
    merchantName: '',
    merchantId: '',
    authStatus: '',
    productName: '',
    authCount: ''
  },
  erpAuthOrderDetails: []
}

export const formWlsOrWcyObj = {
  authOrderDTO: {
    billNo: '', // 单据编码
    createOrderTime: '',
    inventoryAmount: '', // 受理人id
    handManName: '' // 受理人名称
  },
  merchantDTO: {
    agentId: '',
    agentName: '',
    merchantName: '',
    merchantNo: '',
    merchantVersion: '',
    relationProduct: '',
    storeCount: '',
    applicationModule: '',
    delayHour: 1
  },
  detailDTOList: []
}

export const formYsObj = {
  authOrderDTO: {
    billNo: '', // 单据编码
    createOrderTime: '',
    inventoryAmount: '', // 受理人id
    handManName: '', // 受理人名称
    userLevelNum: 1
  },
  merchantDTO: {
    agentId: '',
    agentName: '',
    merchantName: '',
    merchantNo: '',
    applicationSystem: '',
    delayHour: 1,
    probationFlag: ''
  },
  addAuthOrderDetailDTOList: [],
  renewAuthOrderDetailDTOList: []
}

export const formDongleObj = {
  authOrderDTO: {
    billNo: '', // 单据编码
    createOrderTime: '',
    inventoryAmount: '', // 受理人id
    handManName: '' // 受理人名称
  },
  detailDTOList: []
}

export const versionMap = new Map([
  ['2', '标准版'],
  ['3', '专业版'],
  ['5', '基础版']
])

export const cyVersionMap = new Map([
  ['0', '易点易付'],
  ['1', '微餐厅'],
  ['2', '慧猿2.0专业版']
])

export const modulesUserLevel = [
  { label: '1-100用户', value: 1 },
  { label: '101-300用户', value: 2 },
  { label: '301用户以上', value: 3 }
]
