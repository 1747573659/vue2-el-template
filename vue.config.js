const { defineConfig } = require('@vue/cli-service')
const name = '渠道管理平台'
const TerserPlugin = require('terser-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const IS_PROD = ['production'].includes(process.env.NODE_ENV)

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: 'warning',
  publicPath: '/',
  outputDir: 'km-channel-h5',
  productionSourceMap: false,
  devServer: {
    port: 80,
    open: false
  },
  css: {
    extract: IS_PROD,
    sourceMap: false
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch').delete('preload')
  },
  configureWebpack: config => {
    config.name = name
    config.resolve.fallback = {
      path: require.resolve('path-browserify')
    }
    const sassLoader = require.resolve('sass-loader')
    config.module.rules
      .filter(rule => {
        return rule.test.toString().indexOf('scss') !== -1
      })
      .forEach(rule => {
        rule.oneOf.forEach(oneOfRule => {
          const sassLoaderIndex = oneOfRule.use.findIndex(item => item.loader === sassLoader)
          oneOfRule.use.splice(sassLoaderIndex, 0, { loader: require.resolve('css-unicode-loader') })
        })
      })
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        })
      ]
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
})
