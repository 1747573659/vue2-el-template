// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 功能插件

export default {
  async install(Vue) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示
    // https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // Element
    Vue.use(ElementUI)
    // 插件
  }
}
