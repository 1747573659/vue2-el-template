const setting = {
  path: '/setting',
  redirect: '/setting/baseinfo',
  code: 'KM_SETTING',
  name: 'setting',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '设置',
    name: 'setting',
  },
  children: [
    {
      path: 'baseInfo',
      component: () => import('@/pages/setting/layout.vue'),
      code: 'KM_SETTING_BASEINFO',
      name: 'baseInfo',
      meta: {
        title: '基本信息',
        name: 'baseInfo',
      },
      children: [
        {
          path: 'baseInfoIndex',
          component: () => import('@/pages/setting/baseInfo/baseInfo.vue'),
          code: 'KM_SETTING_BASEINFO_INDEX',
          name: 'baseInfoIndex',
          meta: {
            title: '基本信息',
            name: 'baseInfoIndex',
          },
        }
      ]
    },
    {
      path: 'account',
      component: () => import('@/pages/setting/layout.vue'),
      code: 'KM_SETTING_ACCOUNT',
      name: 'account',
      meta: {
        title: '账号管理',
        name: 'account',
      },
      children: [
        {
          path: 'role',
          component: () => import('@/pages/setting/account/role.vue'),
          code: 'KM_SETTING_ACCOUNT_ROLE',
          name: 'role',
          meta: {
            title: '角色管理',
            name: 'role',
          },
        }
      ]
    }
  ]
}

export default setting