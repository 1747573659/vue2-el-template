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
  publicPath: '/',
  outputDir: 'km-channel-' + process.env.ENV,  // 打包输出目录名
  assetsDir: 'static',
  productionSourceMap: false, // 去掉生产环境.map文件
  // 开发时的配置
  devServer: {
    port: 80,
    open: true,
    disableHostCheck: true,
    proxy: getProxyTable(apiObj)
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    // before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // 预加载能提高打开首页的速度，建议打开
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.ENV !== 'dev',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single')
        }
      )
  }
}