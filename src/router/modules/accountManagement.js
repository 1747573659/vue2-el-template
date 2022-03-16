import { _import } from '@/utils'
import Layout from '@/layout'
import kmContainer from '@/components/km-container'

const accountManagement = {
  path: '/accountManagement',
  name: 'accountManagement',
  code: 'XDD_ACCMANAGEMENT',
  component: Layout,
  meta: {
    title: '账款管理',
    name: 'accountManagement'
  },
  children: [
    {
      path: 'accountQuery',
      name: 'accountQuery',
      code: 'XDD_ACCMANAGEMENT_ACCQUERY',
      redirect: { name: 'amountHistory' },
      component: kmContainer,
      meta: {
        title: '账款查询',
        icon: 'el-icon-menu',
        name: 'accountQuery'
      },
      children: [
        {
          path: 'amountHistory',
          component: () => import('@/pages/accountManagement/accountQuery/amountHistory/amountHistory.vue'),
          name: 'amountHistory',
          code: 'XDD_ACCMANAGEMENT_ACCQUERY_AMOUNTHISTORY',
          meta: { title: '余额变动流水', name: 'amountHistory', cache: true }
        }
      ]
    },
    {
      path: 'softStockQuery',
      name: 'softStockQuery',
      code: 'XDD_ACCMANAGEMENT_SOFTSTOCK',
      redirect: { name: 'softStockQuery' },
      component: kmContainer,
      meta: {
        title: '软件库存查询',
        icon: 'el-icon-menu',
        name: 'softStockQuery'
      },
      children: [
        {
          path: 'querySoftStock',
          component: _import('accountManagement/softStockQuery/querySoftStock/querySoftStock.vue'),
          name: 'querySoftStock',
          code: 'XDD_ACCMANAGEMENT_SOFTSTOCK_QUERY',
          meta: { title: '软件库存查询', name: 'querySoftStock', cache: true }
        },
        {
          path: 'softStockChangeHistory',
          component: _import('accountManagement/softStockQuery/softStockChangeHistory/softStockChangeHistory.vue'),
          name: 'softStockChangeHistory',
          code: 'XDD_ACCMANAGEMENT_SOFTSTOCK_HISTORY',
          meta: { title: '软件库存变动流水', name: 'softStockChangeHistory', cache: true }
        },
        {
          path: 'softwareInventoryReplace',
          component: _import('orderCenter/OrderManagement/SoftwareInventoryReplace'),
          name: 'softwareInventoryReplace',
          code: 'ORDERCENTER_ORDERMANAGEMENT_SOFTWAREINVENTORYREPLACE',
          meta: { title: '库存换购订单', name: 'softwareInventoryReplace', cache: true }
        },
        {
          path: 'selfServiceEquipment',
          component: _import('orderCenter/OrderManagement/SelfServiceEquipment/selfServiceEquipment'),
          name: 'selfServiceEquipment',
          code: 'ORDERCENTER_ORDERMANAGEMENT_SELFSERVICEEQUIPMENT',
          meta: { title: '自助设备授权查询', name: 'selfServiceEquipment', cache: false }
        }
      ]
    },
    {
      path: 'resultsQuery',
      name: 'resultsQuery',
      code: 'XDD_RSSULTSQUERY',
      redirect: { name: 'resultsQueryDealer' },
      component: kmContainer,
      meta: {
        title: '业绩查询',
        icon: 'el-icon-menu',
        name: 'resultsQuery'
      },
      children: [
        {
          path: 'resultsQueryDealer',
          component: () => import('@/pages/accountManagement/resultsQuery/resultsQueryDealer/index.vue'),
          name: 'resultsQueryDealer',
          code: 'XDD_RSSULTSQUERY_DEALER',
          meta: { title: '业绩明细查询', name: 'XDD_RSSULTSQUERY_DEALER', cache: true }
        },
        {
          path: 'performanceSummary',
          component: () => import('@/pages/accountManagement/resultsQuery/performanceSummary/performanceSummary.vue'),
          name: 'performanceSummary',
          code: 'XDD_PERFORMANCE_SUMMARY',
          meta: { title: '业绩汇总查询', name: 'XDD_PERFORMANCE_SUMMARY', cache: true }
        }
      ]
    }
  ]
}
export default accountManagement
