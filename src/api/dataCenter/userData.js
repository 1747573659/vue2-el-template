import request from '@/utils/request'
//import { parse} from "query-string";

import qs from 'qs'
const urlLinks = {
  // 分页角色列表
  userdataCount: '/userdata/count'
}
// 校验角色重名
export function userdataCount(data) {
  return request({
    url: urlLinks.userdataCount,
    method: 'post',
    data: data
  })
}
