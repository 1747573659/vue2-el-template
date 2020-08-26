'use strict'
const path = require('path')
// 配置文件详情
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '渠道管理系统' // page title

let apiObj = {
  '/commonApi': process.env.VUE_APP_BASE_API
}
console.log(apiObj)

function getProxyTable (apiObj) {
  let newApiObj = {}
  for (let item in apiObj) {
    newApiObj[item] = {
      target: apiObj[item],
      ws:true,
      changeOrigin: true,
      pathRewrite: {},
      proxyTimeout: 10 * 60 * 1000, // 10mins
      timeout: 10 * 60 * 1000 // 10mins
    }
    newApiObj[item]['pathRewrite']['^' + item] = ''
  }
  return newApiObj
}

module.exports = {
  // 如果是开发环境打包,那么输出的根目录为/kmchannel/
  publicPath: (process.env.VUE_APP_FLAG === 'dev' && process.env.NODE_ENV === 'production') ? '/kmchannel/' : '/',
  outputDir: 'km-channel-' + process.env.VUE_APP_FLAG,  // 打包输出目录名
  assetsDir: 'static',
  productionSourceMap: false, // 去掉生产环境.map文件
  // 开发时的配置
  devServer: {
    port: 80,
    open: false, // 不自动打开浏览器
    disableHostCheck: true,
    proxy: getProxyTable(apiObj)
  }
}