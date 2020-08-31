import Layout from '@/layout'

// 由于懒加载页面太多的话会造成webpack热更新太慢，所以开发环境不使用懒加载，只有生产环境使用懒加载
const _import = require('@/utils/util.import.' + process.env.NODE_ENV)

const setting = {
  path: '/setting',
  redirect: '/setting/baseinfo',
  code: 'KM_SETTING',
  name: 'setting',
  component: Layout,
  meta: {
    title: '设置',
    name: 'setting',
  },
  children: [
    {
      path: 'baseInfo',
      component: _import('setting/layout'),
      code: 'KM_SETTING_BASEINFO',
      name: 'baseInfo',
      meta: {
        title: '基本信息',
        name: 'baseInfo',
      },
      children: [
        {
          path: 'baseInfoIndex',
          component: _import('setting/baseInfo/baseInfo'),
          code: 'KM_SETTING_BASEINFO_INDEX',
          name: 'baseInfoIndex',
          meta: {
            title: '基本信息',
            name: 'baseInfoIndex',
          },
        }
      ]
    }
  ]
}

export default setting