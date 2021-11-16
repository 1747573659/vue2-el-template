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
          path: 'softwareAuthorization',
          component: _import('orderCenter/OrderManagement/SoftwareAuthorization'),
          name: 'softwareAuthorization',
          code: 'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREAUTHORIZATION',
          meta: { title: '软件授权订单', name: 'softwareAuthorization', cache: true }
        },
        {
          path: 'softwareAuthorizationDetails',
          component: _import('orderCenter/OrderManagement/SoftwareAuthorization/softwareAuthorizationDetails'),
          name: 'softwareAuthorizationDetails',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: '软件授权订单详情', name: 'softwareAuthorizationDetails', cache: true }
        },
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
          path: 'softwareInventoryApply',
          component: _import('orderCenter/OrderManagement/SoftwareInventoryApply'),
          name: 'softwareInventoryApply',
          code: 'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREINVENTORYAPPLY',
          meta: { title: '软件库存申请单', name: 'softwareInventoryApply', cache: true }
        },
        {
          path: 'softwareInventoryApplyDetails',
          component: _import('orderCenter/OrderManagement/SoftwareInventoryApply/softwareInventoryApplyDetails'),
          name: 'softwareInventoryApplyDetails',
          code: 'KM_DEFAULT_CODE',
          meta: { title: '软件库存申请详情', name: 'softwareInventoryApplyDetails', cache: true }
        },
        {
          path: 'softwareInventoryReplace',
          component: _import('orderCenter/OrderManagement/SoftwareInventoryReplace'),
          name: 'softwareInventoryReplace',
          code: 'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREINVENTORYREPLACE',
          meta: { title: '软件库存置换单', name: 'softwareInventoryReplace', cache: true }
        },
        {
          path: 'softwareInventoryReplaceDetails',
          component: _import('orderCenter/OrderManagement/SoftwareInventoryReplace/softwareInventoryReplaceDetails'),
          name: 'softwareInventoryReplaceDetails',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          meta: { title: '软件库存置换详情', name: 'softwareInventoryReplaceDetails', cache: true }
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
