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

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: [
    ]
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[name]-[chunkhash].js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    
    // extract css into its own file
    // extractAntd,// ??
    // extractCss,
    /*
    new ExtractTextPlugin({
      // filename: utils.assetsPath('css/[name].[contenthash].css')
      filename: function(getPath){
        console.log(getPath('css/[name].css'));
        return getPath('css/[name].css')
      },
      allChunks: true
    }),
    */
    
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin(),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
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
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      hash: false,

      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    
    /* 从 vendor 里面分离抽取，且注意插件引用顺序：
     name: 'vendor',
     name: 'vendor-antd',
     name: 'vendor-react',
    */
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['app'],
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) && (
            module.resource.indexOf(
              path.join(__dirname, '../node_modules')
            ) === 0 
          )
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor-antd',
      chunks: ['vendor'],
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&(
            module.resource.indexOf(
              path.join(__dirname, '../node_modules/antd/')
            ) === 0 ||
            module.resource.indexOf(
              path.join(__dirname, '../node_modules/moment/')
            ) === 0 ||
            module.resource.indexOf(path.join(__dirname, '../node_modules/rc-calendar')) === 0
          )
          
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor-react',
      chunks: ['vendor'],
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) && (
            module.resource.indexOf(
              path.join(__dirname, '../node_modules/react')
            ) === 0 ||
            module.resource.indexOf(
              path.join(__dirname, '../node_modules/redux')
            ) === 0
          )
        )
      }
    }),
    
    // copy custom static assets
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
