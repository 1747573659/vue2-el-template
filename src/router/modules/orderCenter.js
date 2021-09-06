import { _import } from '@/utils'
import Layout from '@/layout'
import kmContainer from '@/components/km-container'

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
      path: 'orderManagement',
      name: 'orderManagement',
      code: 'ORDERCENTER_ORDERMANAGEMENT',
      component: kmContainer,
      meta: {
        title: '订单管理',
        icon: 'el-icon-menu',
        name: 'orderManagement'
      },
      children: [
        {
          path: 'softwarePurchaseOrder',
          component: _import('orderCenter/OrderManagement/SoftwarePurchaseOrder'),
          name: 'softwarePurchaseOrder',
          code: 'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREPURCHASEORDER',
          meta: { title: '软件采购订单', name: 'softwarePurchaseOrder', cache: true }
        },
        {
          path: 'softwarePurchaseDetails',
          component: _import('orderCenter/OrderManagement/SoftwarePurchaseOrder/softwarePurchaseDetails'),
          name: 'softwarePurchaseDetails',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: '软件采购详情', name: 'softwarePurchaseDetails', cache: true }
        },
        {
          path: 'hardwarePurchaseOrder',
          component: _import('orderCenter/OrderManagement/HardwarePurchaseOrder'),
          name: 'hardwarePurchaseOrder',
          code: 'ORDERCENTER_ORDERMANAGEMENT_HARDWAREPURCHASEORDER',
          meta: { title: '硬件采购订单', name: 'hardwarePurchaseOrder', cache: true }
        },
        {
          path: 'hardwarePurchaseDetails',
          component: _import('orderCenter/OrderManagement/HardwarePurchaseOrder/hardwarePurchaseDetails'),
          name: 'hardwarePurchaseDetails',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: '硬件采购详情', name: 'hardwarePurchaseDetails', cache: true }
        }
      ]
    },
    {
      path: 'validityQuery',
      name: 'validityQuery',
      code: 'ORDERCENTER_VALIDITYQUERY',
      redirect: { name: 'takeawayPeriod' },
      component: kmContainer,
      meta: {
        title: '有效期查询',
        icon: 'el-icon-menu',
        name: 'validityQuery'
      },
      children: [
        {
          path: 'takeawayPeriod',
          component: () => import('@/pages/orderCenter/validityQuery/takeawayPeriod.vue'),
          name: 'takeawayPeriod',
          code: 'ORDERCENTER_VALIDITYQUERY_TAKEAWAYPERIOD',
          meta: { title: '享钱外卖有效期', name: 'takeawayPeriod', cache: true }
        }
      ]
    }
  ]
}
export default orderCenter
