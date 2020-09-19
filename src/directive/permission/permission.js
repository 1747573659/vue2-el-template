import store from '@/store'
import router from '@/router'

function checkPermission(el, binding) {
  // value为权限code
  let { expression: value, modifiers } = binding
  const roles = store.getters && store.getters.btns
  // 此处的权限控制为当前的按钮权限和当前子页面的权限，子页面的权限要把所有的按钮可以跳转到的权限加上去(一般为编辑和新增)
  // 将权限分为数组,按钮为['xxx'],页面为['xxx','xxx']或者更多
  // 然后再将页面按钮以及页面权限数组 和 vuex里存的按钮权限进行对比
  // 页面没有权限就跳转404, 页面按钮没有权限则不进行显示
  value = value.replace(/'/g, '').split(',')
  if (value.length) {
    const hasPermission = roles.findIndex(r => value.includes(r.code)) >= 0

    // 没有权限
    if (!hasPermission) {
      if (modifiers.page) {
        router.replace({ path: '/404' })
      } else {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="'admin'"`)
  }
}

/**
 * 权限控制指令
 * 1、按钮没有权限则移除当前元素
 *    在按钮元素上加【v-permission="'DEL'" 】
 * 2、页面没有权限则跳转到404页面
 *    在页面根元素上加【v-permission.page="'DEL'"】
 */
export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
