import axios from 'axios'
import store from '@/store'
import { getLocal } from '@/utils/token'
import errorLog from '@/utils/util.errorLog'
import { Message, MessageBox } from 'element-ui'

let config = {
  timeout: 5 * 1000, // request timeout 60s
  withCredentials: false, // 跨域请求时是否需要凭证
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
}

const service = axios.create(config)

service.interceptors.request.use(
  config => {
    if (getLocal('token')) {
      // config.headers['Content-Type'] = 'application/x-www-form-urlencoded' // json格式的不需要
      // 从localStorage拿token, 放到每个请求头
      config.headers['token'] = getLocal('token')
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    const code = response.data?.code
    if (code === 0) return res.data
    else if (code === 195001) {
      MessageBox.confirm('超时未操作，系统已自动登出，请重新登录', '重新登录', {
        confirmButtonText: '重新登录',
        type: 'warning',
        showClose: false,
        showCancelButton: false,
        closeOnClickModal: false, // 遮罩层点击不能关闭MessageBox
        beforeClose: action => {
          console.info(action)
          // done()
          if (action === 'cancel') {
            location.reload()
          } else {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
              // this.$router.push({path: '/login'})
            })
          }
        }
      }).catch(err => {
        console.log(err)
      })
      return Promise.reject(res.data || res.msg)
    } else {
      const hasErrorCode = Object.keys(errorLog).includes(String(code))
      Message({
        message: hasErrorCode ? errorLog[String(code)] : res.data || res.msg,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(res.data || res.msg)
    }
  },
  error => {
    // Message({
    //   message: error.response.data.msg || '网络出错~~',
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error && (error.data || error.msg))
  }
)

export default service
