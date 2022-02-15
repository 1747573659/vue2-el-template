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
          meta: { title: '余额变动流水', name: 'amountHistory' }
        }
      ]
    }
  ]
}
export default accountManagement
