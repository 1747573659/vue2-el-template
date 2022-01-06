// 订单状态
export const orderStatus = new Map([
  ["", { value: "", label: "全部" }],
  [0, { value: 0, label: "未提交", name: "编辑" }],
  [5, { value: 5, label: "未提交（被退回）", name: "编辑" }],
  [10, { value: 10, label: "待受理", name: "详情" }],
  [20, { value: 20, label: "待审核", name: "详情" }],
  [30, { value: 30, label: "已审核", name: "详情" }]
]);

// 注册方式
export const oldRegistTypes = new Map([
  ["", { value: "", label: "全部" }],
  [0, { value: 0, label: "软注册" }],
  [1, { value: 1, label: "加密狗" }]
]);
