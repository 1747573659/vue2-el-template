// 订单状态
export const orderStatus = [
  { value: 0, label: '未提交' },
  { value: 1, label: '待受理' },
  { value: 2, label: '待审核' },
  { value: 3, label: '已审核' }
]

// 付款状态
export const paymentStatus = [
  { value: 0, label: '未付款' },
  { value: 1, label: '部分付款' },
  { value: 2, label: '已付款' }
]

// 发货状态
export const deliveryStatus = [
  { value: 0, label: '待发货' },
  { value: 1, label: '待收货' },
  { value: 2, label: '已收货' },
  { value: 3, label: '无需发货' }
]

// 库存类型
export const inventoryType = [
  { value: 0, label: '通用' },
  { value: 1, label: '项目' }
]

export const addressData = [
  { check: true, receiver: '张三', consigneePhone: '18566239697', address: '广东省深圳市前海深港合作区南山街道兴海大道3044号信利康大厦19-20层' },
  { check: false, receiver: '张三', consigneePhone: '0755-87854521', address: '广东省深圳市前海深港合作区信利康大厦19层' },
  { check: false, receiver: '张三', consigneePhone: '0755-87854521', address: '广东省深圳市前海深港合作区信利康大厦19层' },
  { check: false, receiver: '李四', consigneePhone: '18566239697', address: '广东省深圳市前海深港合作区信利康大厦19层' },
  { check: false, receiver: '小明', consigneePhone: '18566239697', address: '广东省深圳市前海深港合作区信利康大厦19层' }
]
