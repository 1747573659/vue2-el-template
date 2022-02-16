import deepClone from './modules/deepClone'
import downloadForURL from './modules/download'
import convertRouter from './modules/convertRouter'
import routeTree from './modules/routeTree'
import MD5Util from './modules/MD5Util'
import _import from './modules/import'
import errorLog from './modules/errorLog'
import resetRedirect from './modules/resetRedirect'
import axios from 'axios'
import qs from 'qs'
import { getLocal } from '@/utils/storage'
import store from '@/store'
import { Message, MessageBox } from 'element-ui'
export function formatNumber (num, precision, separator) {
  let parts
  // 判断是否为数字
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
    // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
    // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
    // 的值变成了 12312312.123456713
    num = Number(num)
    // 处理小数点位数
    num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString()
    // 分离数字的小数部分和整数部分
    parts = num.split('.')
    // 整数部分加[separator]分隔
    parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','))
    return parts.join('.')
  }
  return '0.00'
}
export function formatNumberFilter (num, precision) {
  return formatNumber(num, precision || 0)
}
/**
 * 文件流下载
 * @param {string} url 请求路径
 * @param {any} data 请求参数
 * @param {string} 请求方法(默认为get请求)
 * @param {string} paramsFormat 请求参数格式(默认为x-www-form-urlencoded格式)
 */
export function downloadBufferFile(url, data, method = 'GET', paramsFormat = 'x-www-form-urlencoded') {
  if (method === 'GET') {
    return axios({
      url,
      method,
      headers: {
        token: getLocal('token') || ''
      },
      params: data,
      responseType: 'blob' // 必须是arraybuffer类型
    }).then(response => {
      handleDownloadBufferFile(response, data.name)
    })
  } else {
    if (paramsFormat === 'x-www-form-urlencoded') {
      // 当传参格式为: 'x-www-form-urlencoded'
      return axios({
        url,
        method,
        headers: {
          token: getLocal('token') || ''
        },
        data: qs.stringify(data),
        responseType: 'blob' // 必须是arraybuffer类型
      }).then(response => {
        setTimeout(() => {
          handleDownloadBufferFile(response)
        }, 0)
      })
    }

    if (paramsFormat === 'json') {
      // 当传参格式为: 'json'
      return axios({
        url,
        method,
        headers: {
          token: getLocal('token') || ''
        },
        data,
        responseType: 'blob' // 必须是arraybuffer类型
      }).then(response => {
        if(response.headers['content-type']==='application/json;charset=UTF-8'){
        const data=response.data
        const reader = new FileReader()
        reader.addEventListener('loadend', function (e) {
          let data=JSON.parse(e.target.result)
          if(data.code===195001){
            MessageBox.confirm('超时未操作或账号在其他设备登录，请重新登录', '重新登录', {
              confirmButtonText: '重新登录',
              type: 'warning',
              showClose: false,
              showCancelButton: false,
              closeOnClickModal: false, // 遮罩层点击不能关闭MessageBox
              beforeClose: action => {
                if (action === 'cancel') {
                  location.reload()
                } else {
                  store.dispatch('FedLogOut').then(() => {
                    location.reload() // 为了重新实例化vue-router对象 避免bug
                    // this.$router.push({path: '/login'})
                  })
                }
              }
              }).catch(err => {})
            } else {
              Message.error(data.msg)
            }
          })
          reader.readAsText(data)
        } else {
          setTimeout(() => {
            handleDownloadBufferFile(response)
          }, 0)
        }

      })
    }
  }
}

function handleDownloadBufferFile(response, data) {
  let url = window.URL.createObjectURL(response.data) // 表示一个指定的file对象或Blob对象
  let fileName = '' // filename名称截取
  if ((response.headers['content-disposition'] && response.headers['content-disposition'].length) || (response.headers['Content-Disposition'] && response.headers['Content-Disposition'].length)) {
    let name = decodeURI((response.headers['content-disposition'] || response.headers['Content-Disposition']).split(';')[1].split('=')[1]) || (response.headers['content-disposition'] || response.headers['Content-Disposition']).split(';')[1].split('=')[1]
    fileName = name
    // 兼容ie
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(response.data, fileName)
      return false
    } else {
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = fileName // 命名下载名称
      a.click() // 点击触发下载
      window.URL.revokeObjectURL(url) // 下载完成进行释放
    }
  } else {
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(response, 'xxx.zip')
      return false
    } else {
      // fileName = (response.headers['content-disposition'] || response.headers['Content-Disposition']).split(';')[1].split('=')[1]
      let a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = data || '二维码' // 命名下载名称
      a.click() // 点击触发下载
      window.URL.revokeObjectURL(url) // 下载完成进行释放
    }
  }
}
export {
  deepClone,
  downloadForURL,
  routeTree,
  convertRouter,
  _import,
  resetRedirect,
  MD5Util,
  errorLog
}