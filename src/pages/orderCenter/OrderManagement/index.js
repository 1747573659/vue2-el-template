import { getLocal } from "@/utils/storage";

// 订单状态
export const orderStatus = new Map([
  [-1, { value: -1, label: "全部" }],
  [0, { value: 0, label: "未提交" }],
  [10, { value: 10, label: "待受理" }],
  [20, { value: 20, label: "待审核" }],
  [30, { value: 30, label: "已审核" }]
]);

// 付款状态
export const paymentStatus = new Map([
  [-1, { value: -1, label: "全部" }],
  [0, { value: 0, label: "未付款" }],
  [1, { value: 1, label: "部分付款" }],
  [2, { value: 2, label: "已付款" }]
]);

// 发货状态
export const deliveryStatus = new Map([
  [-1, { value: -1, label: "全部" }],
  [10, { value: 10, label: "待发货" }],
  [20, { value: 20, label: "待收货" }],
  [30, { value: 30, label: "已收货" }],
  [0, { value: 0, label: "无需发货" }]
]);

// 库存类型
export const inventoryType = [
  { value: 0, label: "通用" },
  { value: 1, label: "项目" }
];

export const formObj = {
  from: false,
  purchaseOrderDTO: {
    billNo: "", // 单据编码
    orderAmount: 0, // 订单金额
    handUser: "", // 受理人
    // 收货信息
    receivePeopleName: "", // 收货人
    receivePeoplePhone: "", // 收货人电话
    area: "", // 所在地区
    city: "",
    province: "",
    address: "", // 详细地址
    // 账款信息
    agentPaperMoney: "", // 账面余额
    agentGuaranteeMoney: "", // 未核销担保金
    payStatus: "", // 付款状态
    useGuarantee: "", // 使用担保金
    agentId: JSON.parse(getLocal("userBaseInfo")).agentId, // 经销商id
    agentName: "", // 经销商名称
    useAmountGift: "", // 使用赠金
    // 快递信息
    deliverStatus: "", // 发货状态
    deliverTime: "", // 发货时间
    expressNo: "", // 快递单号
    receiveGoodStatus: "", // 收货状态
    couponStatus: -1,
    orderType: 0,
    createUser: "1",
    createOrderTime: ""
  },
  orderItemList: []
};

export const addressData = [
  {
    check: true,
    receiver: "张三",
    consigneePhone: "18566239697",
    address: "广东省深圳市前海深港合作区南山街道兴海大道3044号信利康大厦19-20层"
  },
  {
    check: false,
    receiver: "张三",
    consigneePhone: "0755-87854521",
    address: "广东省深圳市前海深港合作区信利康大厦19层"
  },
  {
    check: false,
    receiver: "张三",
    consigneePhone: "0755-87854521",
    address: "广东省深圳市前海深港合作区信利康大厦19层"
  },
  {
    check: false,
    receiver: "李四",
    consigneePhone: "18566239697",
    address: "广东省深圳市前海深港合作区信利康大厦19层"
  },
  {
    check: false,
    receiver: "小明",
    consigneePhone: "18566239697",
    address: "广东省深圳市前海深港合作区信利康大厦19层"
  }
];
