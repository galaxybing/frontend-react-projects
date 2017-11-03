var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var DllLinkPlugin = require('dll-link-webpack-plugin');

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var webpackConfig = merge(baseWebpackConfig, {
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[name]/[chunkhash].js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true
      },
      sourceMap: true
    }),
    
    new OptimizeCSSPlugin(),
    
    // 分离插件配置：
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendorLib', filename: 'vendorLib.bundle.js' }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendorAntd',
      chunks: ['vendorLib'],
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) && (
            module.resource.indexOf(
              path.join(__dirname, '../node_modules/antd/')
            ) === 0 /*||
            module.resource.indexOf(
              path.join(__dirname, '../node_modules/moment/')
            ) === 0 ||
            module.resource.indexOf(
              path.join(__dirname, '../node_modules/rc-calendar')
            ) === 0
            */
          )
        )
      }
    }),
    
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendorMoment',
      chunks: ['vendorLib'], // hash 文件更新以后：Uncaught (in promise) Error: Loading chunk 0 failed.
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) && (
            module.resource.indexOf(
              path.join(__dirname, '../node_modules/moment/')
            ) === 0 ||
            module.resource.indexOf(
              path.join(__dirname, '../node_modules/rc-calendar')
            ) === 0
          )
        )
      }
    }),
    
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: path.resolve(__dirname, '../src/index.html'),
      inject: true,

      minify: {
        removeComments: true,
        collapseWhitespace: false,
        removeAttributeQuotes: false,
        keepClosingSlash: true
      },
      hash: false,
      chunksSortMode: 'auto' // auto | dependency
    }),
    
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
