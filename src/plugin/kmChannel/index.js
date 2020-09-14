// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// UI库样式覆盖
import '@/assets/scss/styleForUI/_index.scss'

// 组件
import '@/components'

// 全局路由守卫
import '@/router/permission'

// filters
import * as filters from '@/filters'

// directive
import permission from '@/directive/permission/index.js'

// 功能插件

export default {
  async install(Vue) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示
    // https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // filters
    Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key])
    })
    // directive
    Vue.use(permission)
    // Element
    Vue.use(ElementUI)
    // 插件
  }
}
