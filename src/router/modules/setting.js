import { _import } from '@/utils'
import Layout from '@/layout'
import kmContainer from '@/components/km-container'

const setting = {
  path: '/setting',
  name: 'setting',
  code: 'KM_SETTING',
  component: Layout,
  meta: {
    title: '设置',
    name: 'setting'
  },
  children: [
    {
      path: 'baseInfo',
      name: 'baseInfo',
      code: 'KM_SETTING_BASEINFO',
      redirect: { name: 'baseInfoIndex' },
      component: kmContainer,
      meta: {
        title: '基本信息',
        icon: 'el-icon-menu',
        name: 'baseInfo'
      },
      children: [
        {
          path: 'baseInfoIndex',
          name: 'baseInfoIndex',
          code: 'KM_SETTING_BASEINFO_INDEX',
          component: _import('setting/baseInfo/baseInfo'),
          meta: {
            title: '基本信息',
            name: 'baseInfoIndex',
            cache: true
          }
        }
      ]
    },
    {
      path: 'account',
      name: 'account',
      code: 'KM_SETTING_ACCOUNT',
      redirect: { name: 'role' },
      component: kmContainer,
      meta: {
        title: '账号管理',
        icon: 'el-icon-menu',
        name: 'account'
      },
      children: [
        {
          path: 'role',
          name: 'roleManagement',
          code: 'KM_SETTING_ACCOUNT_ROLE',
          component: _import('setting/account/role/role'),
          meta: {
            title: '角色管理',
            name: 'roleManagement',
            cache: true
          }
        },
        {
          path: 'roleAdd',
          name: 'roleAdd',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('setting/account/role/roleAdd'),
          meta: {
            title: '角色管理/新增',
            name: 'roleAdd',
            cache: true
          }
        },
        {
          path: 'accountSetting',
          name: 'accountSetting',
          code: 'KM_SETTING_ACCOUNT_SET',
          component: _import('setting/account/account/accountSetting'),
          meta: {
            title: '账号设置',
            name: 'accountSetting',
            cache: true
          }
        },
        {
          path: 'accountSettingAdd',
          name: 'accountSettingAdd',
          code: 'KM_DEFAULT_CODE',
          hidden: true,
          component: _import('setting/account/account/accountSettingAdd'),
          meta: {
            title: '账号设置/新增',
            name: 'accountSettingAdd',
            cache: true
          }
        }
      ]
    },
    {
      path: 'material',
      name: 'material',
      code: 'KM_SETTING_MATERIAL',
      redirect: { name: 'materialDownload' },
      component: kmContainer,
      meta: {
        title: '其他',
        icon: 'el-icon-menu',
        name: 'material'
      },
      children: [
        {
          path: 'materialDownload',
          name: 'materialDownload',
          code: 'KM_SETTING_MATERIAL_DOWNLOAD',
          component: _import('setting/materialDownload/materialDownload'),
          meta: {
            title: '资料下载',
            name: 'materialDownload'
          }
        }
      ]
    }
  ]
}

export default setting
