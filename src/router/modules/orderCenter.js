import { _import } from '@/utils'
import Layout from '@/layout'

const orderCenter = {
  path: '/orderCenter',
  name: 'orderCenter',
  code: 'ORDERCENTER',
  component: Layout,
  meta: {
    title: '订单管理',
    name: 'orderCenter'
  },
  children: [
    {
      path: 'validityQuery',
      name: 'validityQuery',
      code: 'ORDERCENTER_VALIDITYQUERY',
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
          code: 'ORDERCENTER_VALIDITYQUERY_TAKEAWAYPERIOD',
          meta: { title: '享钱外卖有效期', noCache: false, roles: ['admin', 'other'], isSubMenu: true, name: 'MerchantOrderQuery' }
        },
        
        
      ]
    }
  ]
}
export default orderCenter
