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
export function permissonCheckMenus (code, url) {
  // console.log(code)
  let permissonMenus = store.getters.permissionMenus
  let routerServe = store.getters.permission_routers
  // console.log(JSON.stringify(routerServe))
  if (permissonMenus && permissonMenus.length) {
    if (url) {
      let urlArr = url.split('/')
      if (JSON.stringify(routerServe).includes(urlArr[1]) && JSON.stringify(routerServe).includes(urlArr[2]) && JSON.stringify(routerServe).includes(urlArr[3])) {
        // JSON.stringify(permissonMenus).includes(code)
        return JSON.stringify(permissonMenus).includes(code)
      } else {
        return false
      }
    }
    return JSON.stringify(permissonMenus).includes(code)
  }
}
/**
 * 文件流下载
 * @param {string} url 请求路径
 * @param {any} data 请求参数
 * @param {string} 请求方法(默认为get请求)
 * @param {string} paramsFormat 请求参数格式(默认为x-www-form-urlencoded格式)
 */
export function downloadBufferFile (url, data, method = 'GET', paramsFormat = 'x-www-form-urlencoded') {
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
        setTimeout(() => {
          handleDownloadBufferFile(response)
        }, 0)
      })
    }
  }
}

function handleDownloadBufferFile (response, data) {
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
      console.log(url)
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
      console.log(url)
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