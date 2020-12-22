'use strict'
const name = '渠道管理平台' // page title
const TerserPlugin = require('terser-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const IS_PROD = ['production'].includes(process.env.NODE_ENV)

let apiObj = {
  '/commonApi': process.env.VUE_APP_BASE_API
}
console.log(apiObj)

const getProxyTable = apiObj => {
  let newApiObj = {}
  for (let item in apiObj) {
    newApiObj[item] = {
      target: apiObj[item],
      ws: true,
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
  publicPath: '/',
  outputDir: 'km-channel-h5', // 打包输出目录名
  // assetsDir: 'static',
  productionSourceMap: false, // 去掉生产环境.map文件
  // 开发时的配置
  devServer: {
    // host: '192.168.241.10',
    port: 80,
    open: false, // 不自动打开浏览器
    disableHostCheck: true,
    proxy: getProxyTable(apiObj)
  },
  css: {
    extract: IS_PROD, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false,
    // https://github.com/vuejs/vue-cli/blob/dev/docs/zh/guide/css.md#css-modules
    // 如果你想去掉文件名中的 .module，可以设置 vue.config.js 中的 css.requireModuleExtension 为 false
    requireModuleExtension: true,
    // 向 CSS 相关的 loader 传递选项(支持 css-loader postcss-loader sass-loader less-loader stylus-loader)
    loaderOptions: {} // Default: {}
  },
  chainWebpack: config => {
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.plugins.delete('prefetch').delete('preload')
  },
  configureWebpack: config => {
    config.name = name
    if (process.env.NODE_ENV === 'production') {
      // 生产环境去掉console.log
      config.optimization.minimizer[
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        })
      ]
      // 添加gzip压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: /\.js$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10k数据进行压缩
          minRatio: 0.8,
          deleteOriginalAssets: false // 是否删除源文件
        })
      )
    }
  }
  // css: {
  //   loaderOptions: {
  //     scss: {
  //       // 全局加载样式，每个Vue组件都可以调用的公共scss
  //       additionalData: `@import "~@/assets/scss/variables.scss";@import "~@/assets/scss/mixin.scss";`
  //     }
  //   }
  // }
}
