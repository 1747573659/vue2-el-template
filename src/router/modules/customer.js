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
      path: 'archive',
      name: 'archive',
      code: 'KM_CUSTOMER_ARCHIVE',
      redirect: { name: 'wxArchive' },
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
            name: 'wxArchiveDetail'
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
    }
  ]
}

export default customer
