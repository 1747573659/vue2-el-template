import { _import } from '@/utils'
import Layout from '@/layout'
import kmContainer from '@/components/km-container'
const customer = {
  path: '/customer',
  name: 'customer',
  code: 'KM_CUSTOMER',
  component: Layout,
  meta: {
    title: '客户管理',
    name: 'customer'
  },
  children: [
    {
      path: 'merchant',
      name: 'merchant',
      code: 'KM_CUSTOMER_MERCHANT',
      redirect: {
        name: 'merchantManage'
      },
      component: kmContainer,
      meta: {
        title: '商户管理',
        name: 'merchant'
      },
      children: [
        {
          path: 'merchantManage',
          name: 'merchantManage',
          code: 'KM_CUSTOMER_MERCHANT_MANAGE',
          component: _import('customer/merchant/merchantManage/merchantHome'),
          meta: {
            title: '商户管理',
            name: 'merchantManage'
          }
        },
        {
          path: 'addMerchant',
          name: 'addMerchant',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('customer/merchant/merchantManage/addMerchant'),
          meta: {
            title: '商户管理/新增',
            name: 'addMerchant',
            cache: true
          }
        },
        {
          path: 'editMerchant',
          name: 'editMerchant',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('customer/merchant/merchantManage/editMerchant'),
          meta: {
            title: '商户管理/编辑',
            name: 'editMerchant',
            cache: true
          }
        },
        {
          path: 'brandHome',
          name: 'brandHome',
          code: 'KM_CUSTOMER_BRAND_MANAGE',
          component: _import('customer/merchant/merchantManage/brandHome'),
          meta: {
            title: '商户品牌管理',
            name: 'brandHome'
          }
        },
        {
          path: 'addBrand',
          name: 'addBrand',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('customer/merchant/merchantManage/addBrand'),
          meta: {
            title: '品牌管理/新增',
            name: 'addBrand',
            cache: true
          }
        },
        {
          path: 'editBrand',
          name: 'editBrand',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('customer/merchant/merchantManage/editBrand'),
          meta: {
            title: '品牌管理/编辑',
            name: 'editBrand',
            cache: true
          }
        }
      ]
    },
    {
      path: 'archive',
      name: 'archive',
      code: 'KM_CUSTOMER_ARCHIVE',
      redirect: {
        name: 'wxArchive'
      },
      component: kmContainer,
      meta: {
        title: '进件管理',
        name: 'archive'
      },
      children: [
        {
          path: 'wxArchive',
          name: 'wxArchive',
          code: 'KM_CUSTOMER_ARCHIVE_WX',
          component: _import('customer/archive/wxArchive/wxArchiveList'),
          meta: {
            title: '普通资质进件',
            name: 'wxArchive'
          }
        },
        {
          path: 'wxArchiveAdd',
          name: 'wxArchiveAdd',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('customer/archive/wxArchive/wxArchiveAdd'),
          meta: {
            title: '普通资质进件/新增',
            name: 'wxArchiveAdd'
          }
        },
        {
          path: 'wxArchiveDetail',
          name: 'wxArchiveDetail',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('customer/archive/wxArchive/wxArchiveDetail'),
          meta: {
            title: '进件详情',
            name: 'wxArchiveDetail',
            cache: true
          }
        },
        {
          path: 'xftArchive',
          name: 'xftArchive',
          code: 'KM_CUSTOMER_ARCHIVE_XFT',
          component: _import('customer/archive/xftArchive/xftArchiveList'),
          meta: {
            title: '享付通资质进件',
            name: 'xftArchive'
          }
        },
        {
          path: 'xftArchiveAdd',
          name: 'xftArchiveAdd',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('customer/archive/xftArchive/xftArchiveAdd'),
          meta: {
            title: '享付通资质进件/新增',
            name: 'xftArchiveAdd'
          }
        },
        {
          path: 'xftArchiveDetail',
          name: 'xftArchiveDetail',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('customer/archive/xftArchive/xftArchiveDetail'),
          meta: {
            title: '进件详情',
            name: 'xftArchiveDetail'
          }
        }
      ]
    },
    {
      path: 'agent',
      name: 'agent',
      code: 'KM_CUSTOMER_AGENT',
      redirect: {
        name: 'merchantManage'
      },
      component: kmContainer,
      meta: {
        title: '代理商管理',
        name: 'agent'
      },
      children: [
        {
          path: 'agentManage',
          name: 'agentManage',
          code: 'KM_CUSTOMER_AGENT_HOME',
          component: _import('customer/agent/agentManage/agentHome'),
          meta: {
            title: '代理商管理',
            name: 'agentManage'
          }
        },
        {
          path: 'addAgent',
          name: 'addAgent',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('customer/agent/agentManage/addAgent'),
          meta: {
            title: '代理商管理/新增',
            name: 'addAgent',
            cache: true
          }
        },
        {
          path: 'editAgent',
          name: 'editAgent',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('customer/agent/agentManage/editAgent'),
          meta: {
            title: '代理商管理/编辑',
            name: 'editAgent',
            cache: true
          }
        },
        {
          path: 'agentRole',
          name: 'agentRole',
          code: 'KM_CUSTOMER_AGENT_ROLE',
          component: _import('customer/agent/agentManage/roleHome'),
          meta: {
            title: '代理商角色',
            name: 'agentRole'
          }
        },
        {
          path: 'addRole',
          name: 'addRole',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('customer/agent/agentManage/addRole'),
          meta: {
            title: '代理商角色管理/新增',
            name: 'addRole',
            cache: true
          }
        },
        {
          path: 'editRole',
          name: 'editRole',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('customer/agent/agentManage/editRole'),
          meta: {
            title: '代理商角色管理/编辑',
            name: 'editRole',
            cache: true
          }
        }
      ]
    },
    {
      path: 'workorder',
      name: 'workorder',
      code: 'WORKORDER',
      redirect: {
        name: 'workOrderManagement'
      },
      component: kmContainer,
      meta: {
        title: '工单管理',
        name: 'workorder'
      },
      children: [
        {
          path: 'workOrderManagement',
          component: () => import('@/pages/orderCenter/validityQuery/workOrderManagement.vue'),
          name: 'workOrderManagement',
          code: 'WORKORDERMANAGEMENT',
          meta: { title: '工单管理', noCache: false, name: 'workOrderManagement' }
        },
        {
          path: 'workOrderManagementdetail',
          component: () => import('@/pages/orderCenter/validityQuery/workOrderManagementdetail.vue'),
          name: 'workOrderManagementdetail',
          hidden: true,
          code: 'WORKORDERMANAGEMENTDETAIL',
          meta: { title: '新增工单',name: 'workOrderManagementdetail' }
        },
        {
          path: 'workOrderdetail',
          component: () => import('@/pages/orderCenter/validityQuery/workOrderdetail.vue'),
          name: 'workOrderdetail',
          hidden: true,
          code: 'WORKORDERMANAGEMENTDETAIL',
          meta: { title: '工单管理详情',name: 'workOrderManagementdetail' }
        }
      ]
    }
  ]
}

export default customer
