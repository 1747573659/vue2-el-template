import request from '@/utils/request'
//import { parse} from "query-string";

import qs from 'qs'
const urlLinks = {
  // 分页角色列表
  addWorkOrder: '/workOrder/addWorkOrder',
  queryProductList: '/workOrder/queryProductList',
  queryAgent: '/agentUser/queryAgent',
  queryWorkOrderList: '/workOrder/queryWorkOrderList',
  queryOrderDetail: '/workOrder/queryOrderDetail'
}
// 校验角色重名
export function addWorkOrder(data) {
  return request({
    url: urlLinks.addWorkOrder,
    method: 'post',
    data: data
  })
}
export function queryProductList(data) {
  return request({
    url: urlLinks.queryProductList,
    method: 'post',
    isOld:true,
    data:qs.stringify(data)
  })
}
export function queryAgent(data) {
  return request({
    url: urlLinks.queryAgent,
    method: 'post',
    data: data
  })
}
export function queryWorkOrderList(data) {
  return request({
    url: urlLinks.queryWorkOrderList,
    method: 'post',
    data: data
  })
}
export function queryOrderDetail(data) {
  return request({
    url: urlLinks.queryOrderDetail,
    method: 'post',
    isOld:true,
    data:qs.stringify(data)
  })
}
