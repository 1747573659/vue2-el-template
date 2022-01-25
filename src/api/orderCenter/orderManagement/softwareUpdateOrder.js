import request from '@/utils/request'

// 列表
export function querySoftUpgradePage(data) {
  return request({
    url: '/channel/soft/upgrade/page',
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
export function channelSoftUpgradeAdd(data) {
  return request({
    url: '/channel/soft/upgrade/add',
    method: 'POST',
    data
  })
}

// 更新
export function channelSoftUpgradeUpdate(data) {
  return request({
    url: '/channel/soft/upgrade/update',
    method: 'POST',
    data
  })
}

// 更新
export function channelSoftUpgradeById(data) {
  return request({
    url: '/channel/soft/upgrade/queryById/' + data,
    method: 'POST',
    data
  })
}

// 删除
export function channelSoftUpgradeDel(data) {
  return request({
    url: '/channel/soft/upgrade/del/' + data,
    method: 'POST',
    data
  })
}

// 提交
export function channelSoftUpgradeSubmit(data) {
  return request({
    url: '/channel/soft/upgrade/submit',
    method: 'POST',
    data
  })
}

// 导出
export function channelSoftUpgradeExport(data) {
  return request({
    url: '/channel/soft/upgrade/export',
    method: 'POST',
    data
  })
}

// 导出记录
export function channelSoftUpgradeExportLog(data) {
  return request({
    url: '/export/log/page',
    method: 'POST',
    data
  })
}

// 导出删除
export function channelSoftUpgradeExportDel(data) {
  return request({
    url: '/channel/soft/upgrade/del/' + data,
    method: 'POST'
  })
}
