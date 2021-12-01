import axios from 'axios'
import {
  getLocal
} from '@/utils/storage'

// json格式就传data,urlencode就传params
export function getLoadBufferImage({
  url,
  data = {},
  params = {},
  method = 'POST'
}) {
  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      headers: {
        token: getLocal('token') || ''
      },
      data: Object.keys(data).length ? data : undefined,
      params: Object.keys(params).length ? params : undefined,
      responseType: 'blob' // 必须是arraybuffer类型
    }).then(res => {
      if (res.data.code) {
        this.$message.error(res.data.msg)
        reject(res.data)
      } else {
        let name
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        const matches = filenameRegex.exec(res.headers['content-disposition'])
        if (matches != null && matches[1]) {
          name = matches[1].replace(/['"]/g, '')
        }
        resolve({ url: window.URL.createObjectURL(res.data), name })
      }
    }, err => {
      reject(err)
    })
  })
}

export function downLoadImg(url, name = '下载图片.jpg') {
  let a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = name // 命名下载名称
  a.click() // 点击触发下载
  window.URL.revokeObjectURL(url) // 下载完成进行释放
}