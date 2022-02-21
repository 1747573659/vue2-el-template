import request from '@/utils/request'

// 列表
export function queryErpTransferPage(data) {
  return request({
    url: '/channel/erp/transfer/page',
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

// 商户名称分页查询
export function authShopPage(data) {
  return request({
    url: '/authShop/page',
    method: 'POST',
    data
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

// 新增
export function channelErpTransferAdd(data) {
  return request({
    url: '/channel/erp/transfer/add',
    method: 'POST',
    data
  })
}

// 更新
export function channelErpTransferUpdate(data) {
  return request({
    url: '/channel/erp/transfer/update',
    method: 'POST',
    data
  })
}

// 更新
export function channelErpTransferById(data) {
  return request({
    url: '/channel/erp/transfer/queryById/' + data,
    method: 'POST',
    data
  })
}

// 删除
export function channelErpTransferDel(data) {
  return request({
    url: '/channel/erp/transfer/del/' + data,
    method: 'POST',
    data
  })
}

// 提交
export function channelErpTransferSubmit(data) {
  return request({
    url: '/channel/erp/transfer/submit',
    method: 'POST',
    data
  })
}

// 导出
export function channelErpTransferExport(data) {
  return request({
    url: '/channel/erp/transfer/export',
    method: 'POST',
    data
  })
}

// 导出记录
export function channelErpTransferExportLog(data) {
  return request({
    url: '/export/log/page',
    method: 'POST',
    data
  })
}

// 导出删除
export function channelErpTransferExportDel(data) {
  return request({
    url: '/channel/erp/transfer/del/' + data,
    method: 'POST'
  })
}