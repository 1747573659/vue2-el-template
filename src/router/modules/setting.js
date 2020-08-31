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
          component: () => import('@/pages/setting/account/role/role.vue'),
          code: 'KM_SETTING_ACCOUNT_ROLE',
          name: 'role',
          meta: {
            title: '角色管理',
            name: 'role',
          },
        },
        {
          path: 'roleAdd',
          component: () => import('@/pages/setting/account/role/roleAdd.vue'),
          code: 'KM_SETTING_ACCOUNT_ROLEADD',
          name: 'roleAdd',
          meta: {
            title: '角色管理',
            name: 'roleAdd',
          },
        },
        {
          path: 'accountSetting',
          component: () => import('@/pages/setting/account/account/accountSetting.vue'),
          code: 'KM_SETTING_ACCOUNT_SET',
          name: 'accountSetting',
          meta: {
            title: '账号设置',
            name: 'accountSetting',
          },
        },
        {
          path: 'accountSettingAdd',
          component: () => import('@/pages/setting/account/account/accountSettingAdd.vue'),
          code: 'KM_SETTING_ACCOUNT_SETADD',
          name: 'accountSettingAdd',
          meta: {
            title: '账号设置/新增',
            name: 'accountSettingAdd',
          },
        }
      ]
    },
    {
      path: 'material',
      component: () => import('@/pages/setting/layout.vue'),
      code: 'KM_SETTING_MATERIAL',
      name: 'material',
      meta: {
        title: '基本信息',
        name: 'material',
      },
      children: [
        {
          path: 'materialDownload',
          component: () => import('@/pages/setting/materialDownload/materialDownload.vue'),
          code: 'KM_SETTING_MATERIAL_DOWNLOAD',
          name: 'materialDownload',
          meta: {
            title: '基本信息',
            name: 'materialDownload',
          },
        }
      ]
    },
  ]
}

export default setting