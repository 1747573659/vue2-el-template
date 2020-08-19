const setting = {
  path: '/setting',
  redirect: '/setting/baseinfo',
  component: () => import('@/views/setting/layout.vue'),
  code: 'KM_SETTING',
  name: 'setting',
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