import axios from 'axios'
// import { Message, MessageBox } from 'km-ui'
import store from '@/store'
import { Message, MessageBox } from 'element-ui'
import { getToken } from '@/utils/token'

let config = {
  timeout: 5 * 000, // request timeout 60s
  // 跨域请求时是否需要凭证
  withCredentials: false,
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
}
// 创建一个可配置的axios实例service
const service = axios.create(config)

// 在请求或响应被 then 或 catch 处理前拦截它们。
// 添加请求拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 从localStorage拿token, 放到每个请求头
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    // console.log(error + 111111) // for debug
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    // console.log(response)
    const res = response.data
    // 当响应状态为200时
    if (response.status === 200) {
      // 当返回code码为0时，直接return数据
      if (res.code === 0) {
        return res.data
      // 当token超时, 则重新登录
      } else if (res.code === 190001) {
        MessageBox.confirm(
          '超时未操作，系统已自动登出，请重新登录',
          '重新登录',
          {
            confirmButtonText: '重新登录',
            // cancelButtonText: '取消',
            type: 'warning',
            showClose: false,
            showCancelButton: false,
            closeOnClickModal: false, // 遮罩层点击不能关闭MessageBox
            beforeClose: (action, instance, done) => {
              // done()
              if (action === 'cancel') {
                // MessageBox.close()
                location.reload()
              } else {
                // 调用登出方法,清除本地存储信息和vuex的登录相关数据
                store.dispatch('FedLogOut').then(() => {
                  location.reload() // 为了重新实例化vue-router对象 避免bug
                  // this.$router.push({path: '/login'})
                })
              }
            }
          }
        ).catch(err => {
          console.log(err)
        })
        return Promise.reject(res.data || res.msg)
        // return false
      } else {
        Message({
          message: res.data || res.msg,
          type: 'error',
          duration: 3000
        })
        return Promise.reject(res.data || res.msg)
      }
    } else {
      Message({
        message: res.data || res.msg,
        type: 'error',
        duration: 3000
      })
      return Promise.reject(res.data || res.msg)
    }
  },
  err => {
    // console.log(err.response) // for debug
    Message({
      message: err.response.data.msg || '网络出错~~',
      type: 'error',
      duration: 5000
    })
    return Promise.reject(err)
  }
)
export default service
