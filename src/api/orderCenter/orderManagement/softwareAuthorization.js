import request from '@/utils/request'
import qs from 'qs'

// 分页列表-授权订单列表
export function queryByPage(data) {
  return request({
    url: '/auth/order/page',
    method: 'POST',
    data
  })
}

// 导出
export function authOrderExport(data) {
  return request({
    url: '/auth/order/export/' + data.menu,
    method: 'POST',
    data: data.params
  })
}

// 导出记录
export function authOrderExportLog(data) {
  return request({
    url: '/export/log/page',
    method: 'POST',
    data
  })
}

// 导出删除
export function authOrderExportDel(data) {
  return request({
    url: '/export/log/' + data + '/del',
    method: 'POST'
  })
}

// 产品管理-分页
export function authOrderProductPage(data) {
  return request({
    url: '/product/queryByPage',
    method: 'POST',
    data
  })
}

// 删除-授权订单列表
export function authOrderDelete(data) {
  return request({
    url: '/auth/order/del/' + data,
    method: 'POST'
  })
}

// 详情-erp授权订单
export function authOrderErpDetail(data) {
  return request({
    url: '/auth/order/erp/' + data,
    method: 'POST'
  })
}

// 更新-erp授权订单
export function authOrderErpUpdate(data) {
  return request({
    url: '/auth/order/erp/update',
    method: 'POST',
    data
  })
}

// 详情-提交erp
export function authOrderErpSubmit(data) {
  return request({
    url: '/auth/order/erp/submit',
    method: 'POST',
    data
  })
}

// 新增-erp授权订单
export function authOrderErpAdd(data) {
  return request({
    url: '/auth/order/erp/add',
    method: 'POST',
    data
  })
}

// 详情-微零售授权订单
export function authOrderWlsDetail(data) {
  return request({
    url: '/auth/order/wls/' + data,
    method: 'POST'
  })
}

// 详情-提交微零售
export function authOrderWlsSubmit(data) {
  return request({
    url: '/auth/order/wls/submit',
    method: 'POST',
    data
  })
}

// 更新-微零售授权订单
export function authOrderWlsUpdate(data) {
  return request({
    url: '/auth/order/wls/update',
    method: 'POST',
    data
  })
}

// 新增-微零售授权订单
export function authOrderWlsAdd(data) {
  return request({
    url: '/auth/order/wls/add',
    method: 'POST',
    data
  })
}

// 详情-微餐饮授权订单
export function authOrderWcyDetail(data) {
  return request({
    url: '/auth/order/wcy/' + data,
    method: 'POST'
  })
}

// 更新-微餐饮授权订单
export function authOrderWcyUpdate(data) {
  return request({
    url: '/auth/order/wcy/update',
    method: 'POST',
    data
  })
}
// 新增-微餐饮授权订单
export function authOrderWcyAdd(data) {
  return request({
    url: '/auth/order/wcy/add',
    method: 'POST',
    data
  })
}

// 详情-提交微餐饮
export function authOrderWcySubmit(data) {
  return request({
    url: '/auth/order/wcy/submit',
    method: 'POST',
    data
  })
}

// 详情-微餐饮授权订单
export function authOrderYsDetail(data) {
  return request({
    url: '/auth/order/ys/' + data,
    method: 'POST'
  })
}

// 更新-云商授权订单
export function authOrderYsUpdate(data) {
  return request({
    url: '/auth/order/ys/update',
    method: 'POST',
    data
  })
}
// 新增-云商授权订单
export function authOrderYsAdd(data) {
  return request({
    url: '/auth/order/ys/add',
    method: 'POST',
    data
  })
}

// 详情-提交云商
export function authOrderYsSubmit(data) {
  return request({
    url: '/auth/order/ys/submit',
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

// 产品模块-集合
export function authModuleList(data) {
  return request({
    url: '/product/module/list',
    method: 'POST',
    data
  })
}

// ERP查询库存
export function queryByAgentErpProduct(data) {
  return request({
    url: '/soft/inventory/queryByAgentProductList',
    method: 'POST',
    data
  })
}

// 查询库存
export function queryByAgentProduct(data) {
  return request({
    url: '/soft/inventory/queryByAgentProduct',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 银联通道分页
export function queryChannelPage(data) {
  return request({
    url: '/pay/channel/page',
    method: 'POST',
    data
  })
}

// 商户列表-授权商户-[新增/编辑-微零售授权订单]
export function authOrderWlsCustList(data) {
  return request({
    url: '/auth/order/wls/getCustList',
    method: 'POST',
    data
  })
}

// 商户信息-授权商户-[新增/编辑-微零售授权订单]
export function authOrderWlsCustInfo(data) {
  return request({
    url: '/auth/order/wls/getCustInfo',
    method: 'POST',
    data
  })
}

// 商户列表-[新增/编辑-微餐饮授权订单]
export function authOrderWcyCustList(data) {
  return request({
    url: '/auth/order/wcy/getCustList',
    method: 'POST',
    data
  })
}

// 商户信息-[新增/编辑-微餐饮授权订单页面]
export function authOrderWcyCustInfo(data) {
  return request({
    url: '/auth/order/wcy/getCustInfo',
    method: 'POST',
    data
  })
}

// 门店列表-[授权对象-新增/编辑-微餐饮授权订单页面]
export function authOrderWcyBranchList(data) {
  return request({
    url: '/auth/order/wcy/getBranchList',
    method: 'POST',
    data
  })
}

// 税号=电子发票-[授权对象-新增/编辑-微餐饮授权订单页面]
export function authOrderWcyTaxpayerNum(data) {
  return request({
    url: '/auth/order/wcy/getTaxpayerNum',
    method: 'POST',
    data
  })
}

// 商户信息-云商-新增/编辑-获取正式客户列表信息
export function authOrderYsCustomerList(data) {
  return request({
    url: '/auth/order/ys/getFormalCustomerList',
    method: 'POST',
    data
  })
}

// 应用模块-云商授权订单
export function authOrderYsAppModules(data) {
  return request({
    url: '/auth/order/ys/appModules',
    method: 'POST',
    data
  })
}

// 站点详情-云商-新增/编辑
export function authOrderYsTrialPointDetail(data) {
  return request({
    url: '/auth/order/ys/getTrialPointDetail',
    method: 'POST',
    data
  })
}

// 查询-小蜜有批-用户级别
export function authOrderYsXmypUserNum(data) {
  return request({
    url: '/auth/order/ys/getXmypUserNum/' + data,
    method: 'POST'
  })
}

// 云商-根据客户和应用获取用户信息-社区续费选用户使用
export function authOrderYsByCusAndApplyList(data) {
  return request({
    url: '/auth/order/ys/getUserByCusAndApplyList',
    method: 'POST',
    data
  })
}

// 操作日志
export function authOrderLog(data) {
  return request({
    url: '/auth/order/log/' + data,
    method: 'POST'
  })
}

// 根据产品编码+模块编码 查询周边产品=商家助手，积分商城，电子发票
export function queryByAgentProductAndModule(data) {
  return request({
    url: '/product/queryByZbProduct/' + data.productCode + '/' + data.moduleId,
    method: 'POST'
  })
}

// 新增-加密狗授权订单
export function authOrderDogAdd(data) {
  return request({
    url: '/auth/order/dog/add',
    method: 'POST',
    data
  })
}

// 详情-加密狗授权订单
export function authOrderDogById(data) {
  return request({
    url: '/auth/order/dog/byId/' + data,
    method: 'POST'
  })
}

// 更新-加密狗授权订单
export function authOrderDogUpdate(data) {
  return request({
    url: '/auth/order/dog/update',
    method: 'POST',
    data
  })
}

// 提交-加密狗授权订单
export function authOrderDogSubmit(data) {
  return request({
    url: '/auth/order/dog/submit',
    method: 'POST',
    data
  })
}

// 提交-加密狗授权订单
export function queryAllProductList() {
  return request({
    url: '/product/list',
    method: 'POST'
  })
}

// 是否显示授权门店栏目
export function getOrderErpCode(data) {
  return request({
    url: '/auth/order/erp/code/' + data,
    method: 'POST'
  })
}
