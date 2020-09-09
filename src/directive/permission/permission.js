import store from '@/store'
import router from '@/router'

function checkPermission(el, binding) {
  // value为权限code
  let { expression: value, modifiers } = binding
  const roles = store.getters && store.getters.btns

  if (value) {
    const hasPermission = roles.findIndex(r => r.code == value.replace(/'/g, '')) >= 0

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
