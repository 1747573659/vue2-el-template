import { _import } from '@/utils'
import Layout from '@/layout'

const dataCenter = {
  path: '/dataCenter',
  name: 'dataCenter',
  code: 'KM_SETTING',
  component: Layout,
  meta: {
    title: '交易数据',
    name: 'dataCenter'
  },
  children: [
    {
      path: 'transactionInquiry',
      name: 'transactionInquiry',
      code: 'KM_SETTING_BASEINFO',
      redirect: { name: 'baseInfoIndex' },
      component: _import('dataCenter/index'),
      meta: {
        title: '交易查询',
        name: 'transactionInquiry'
      },
      children: [
        {
          path: 'merchantOrderQuery',
          component: () => import('@/pages/dataCenter/transactionInquiry/merchantOrderQuery.vue'),
          name: 'MerchantOrderQuery',
          code: 'KM_SETTING_BASEINFO_INDEX',
          meta: { title: '商户订单查询', noCache: false, roles: ['admin', 'other'], isSubMenu: true, name: 'MerchantOrderQuery' }
        },
        {
          path: 'singleOrderQuery',
          component: () => import('@/pages/dataCenter/transactionInquiry/singleOrderQuery.vue'),
          name: 'SingleOrderQuery',
          code: 'KM_SETTING_BASEINFO_INDEX',
          meta: { title: '单笔订单查询', noCache: false, roles: ['admin', 'other'], isSubMenu: true, name: 'SingleOrderQuery' }
        },
        {
          path: 'refundOrderQuery',
          component: () => import('@/pages/dataCenter/transactionInquiry/refundOrderQuery.vue'),
          name: 'RefundOrderQuery',
          code: 'KM_SETTING_BASEINFO_INDEX',
          meta: { title: '退款订单查询', noCache: false, roles: ['admin', 'other'], isSubMenu: true, name: 'RefundOrderQuery' }
        }
      ]
    }
  ]
}
export default dataCenter
