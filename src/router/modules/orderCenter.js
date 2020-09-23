import { _import } from '@/utils'
import Layout from '@/layout'

const orderCenter = {
  path: '/orderCenter',
  name: 'orderCenter',
  code: 'KM_SETTING',
  component: Layout,
  meta: {
    title: '订单管理',
    name: 'orderCenter'
  },
  children: [
    {
      path: 'validityQuery',
      name: 'validityQuery',
      code: 'KM_SETTING_BASEINFO',
      redirect: { name: 'baseInfoIndex' },
      component: _import('dataCenter/index'),
      meta: {
        title: '有效期查询',
        name: 'validityQuery'
      },
      children: [
        {
          path: 'takeawayPeriod',
          component: () => import('@/pages/orderCenter/validityQuery/takeawayPeriod.vue'),
          name: 'takeawayPeriod',
          code: 'KM_SETTING_BASEINFO_INDEX',
          meta: { title: '享钱外卖有效期', noCache: false, roles: ['admin', 'other'], isSubMenu: true, name: 'MerchantOrderQuery' }
        },
        {
          path: 'workOrderManagement',
          component: () => import('@/pages/orderCenter/validityQuery/workOrderManagement.vue'),
          name: 'workOrderManagement',
          code: 'KM_SETTING_BASEINFO_INDEX',
          meta: { title: '工单管理', noCache: false, roles: ['admin', 'other'], isSubMenu: true, name: 'MerchantOrderQuery' }
        },
        {
          path: 'workOrderManagementdetail',
          component: () => import('@/pages/orderCenter/validityQuery/workOrderManagementdetail.vue'),
          name: 'workOrderManagementdetail',
          code: 'KM_SETTING_BASEINFO_INDEX',
          meta: { title: '工单管理详情', noCache: false, roles: ['admin', 'other'], isSubMenu: true, name: 'MerchantOrderQuery' }
        }
        
      ]
    }
  ]
}
export default orderCenter
