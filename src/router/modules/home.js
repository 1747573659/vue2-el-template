const setting = {
  path: '/setting',
  redirect: '/setting/baseinfo',
  code: 'KM_SETTING',
  name: 'setting',
  component: () => import('@/views/setting/layout.vue'),
  meta: {
    title: '设置',
    name: 'setting',
  },
  children: [
    {
      path: 'baseInfo',
      component: () => import('@/views/setting/baseInfo/baseInfo.vue'),
      code: 'KM_SETTING_BASEINFO',
      name: 'baseInfo',
      meta: {
        title: '基本信息',
        name: 'baseInfo',
      }
    }
  ]
}

export default setting