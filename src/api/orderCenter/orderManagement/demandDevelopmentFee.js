import request from '@/utils/request'

// 列表
export function queryChannelDevelopPage(data) {
  return request({
    url: '/channel/require/develop/page',
    method: 'POST',
    data
  })
}

// 查询产品
export function queryProductCode(data) {
  return request({
    url: '/channel/require/develop/queryProductCode',
    method: 'POST',
    data
  })
}

// 新增
export function channelDevelopAdd(data) {
  return request({
    url: '/channel/require/develop/add',
    method: 'POST',
    data
  })
}

// 详情
export function channelDevelopById(data) {
  return request({
    url: '/channel/require/develop/queryById/' + data,
    method: 'POST'
  })
}

// 更新
export function channelDevelopUpdate(data) {
  return request({
    url: '/channel/require/develop/update',
    method: 'POST',
    data
  })
}

// 提交
export function channelDevelopSubmit(data) {
  return request({
    url: '/channel/require/develop/submit',
    method: 'POST',
    data
  })
}

// 删除
export function channelDevelopDelete(data) {
  return request({
    url: '/channel/require/develop/del/' + data,
    method: 'POST'
  })
}

// 日志，需求开发单，软件审计单，erp授权转移都用此日志
export function channelDevelopLog(data) {
  return request({
    url: '/channel/require/develop/log',
    method: 'POST',
    data
  })
}

// 导出
export function channelExport(data) {
  return request({
    url: '/channel/require/develop/export',
    method: 'POST',
    data
  })
}

// 导出记录
export function channelExportLog(data) {
  return request({
    url: '/export/log/page',
    method: 'POST',
    data
  })
}

// 导出删除
export function channelExportDel(data) {
  return request({
    url: '/channel/require/develop/del/' + data,
    method: 'POST'
  })
}