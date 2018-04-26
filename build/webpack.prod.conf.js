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

const extractCss = new ExtractTextPlugin({
  filename: utils.assetsPath('css/[name].css'),
  disable: process.env.NODE_ENV === "development"
});
const extractLib = new ExtractTextPlugin({
  filename: utils.assetsPath('css/lib-[name].css'),
  disable: process.env.NODE_ENV === "development"
});

var join = path.join;
var existsSync = require('fs').existsSync;
const pkgPath = join(__dirname, '../package.json');
const pkg = existsSync(pkgPath) ? require(pkgPath) : {};
let theme = {};
if (pkg.theme && typeof(pkg.theme) === 'string') {
  let cfgPath = pkg.theme;
  // relative path
  if (cfgPath.charAt(0) === '.') {
    cfgPath = resolve(args.cwd, cfgPath);
  }
  const getThemeConfig = require(cfgPath);
  theme = getThemeConfig();
} else if (pkg.theme && typeof(pkg.theme) === 'object') {
  theme = pkg.theme;
};

let examplesVersion = '';
if (pkg.examplesVersion && typeof(pkg.examplesVersion) === 'string') {
  examplesVersion = pkg.examplesVersion;
};

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: [
      {/* 自定义的组件，样式 css-modules 化？？如果需要使用其他的 css 预编译程序，则可以去除以下两条配置 */
        test: /(\.css|\.less)$/, include: [resolve('src/components'), resolve('src/views/'), resolve(`examples/v${examplesVersion}/views/`)], use: extractCss.extract({
          use: [
              {
                loader: "css-loader",
                options: {
                  importLoaders: 1,
                  modules: true,
                  url: true,
                  minimize: process.env.NODE_ENV === 'production',
                  sourceMap: config.build.productionSourceMap,
                  localIdentName: '[name]__[local]___[hash:base64:5]',
                }
            },{
              loader: "less-loader"
            },{
              loader: 'postcss-loader',
              options: {
                plugins: process.env.NODE_ENV === 'production' ? (loader) => [require('postcss-import')({ root: loader.resourcePath }), require('autoprefixer')(),] : []
              }
            }
          ],
          fallback: "style-loader"
        })
      },
      {
        test: /(\.css|\.less)$/, exclude: [resolve('src/components'), resolve('src/views/'), resolve(`examples/v${examplesVersion}/views/`)], use: extractLib.extract({
          use: [{
            loader: "css-loader",
            options: {
              modules: false,
              url: true,
              minimize: process.env.NODE_ENV === 'production',
              sourceMap: config.build.productionSourceMap,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            }
          },{
            loader: "less-loader",
            options: {
              modifyVars: theme
            }
          }],
          fallback: "style-loader"
        })
      },
    ]
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[name]/[chunkhash].js') // [name] bundle-loader 的name配置值
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
    new webpack.DllReferencePlugin({
      manifest: require('../dist/vendors-manifest.json'), // json
      name: 'vendors' // 当前 Dll 的所有内容都会存放在这个参数指定变量名的一个全局变量下；
                      // 注意与 webpack.dll.conf 配置文件内的 DllPlugin 的 name 参数保持一致
    }),
    new webpack.DllReferencePlugin({
      manifest: require('../dist/vendorsReact-manifest.json'),
      name: 'vendorsReact'
    }),

    /*
    // 分离插件配置：
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendorAntd',
      chunks: ['vendor'],
      minChunks: function (module, count) {
        
        return (
          module.resource &&
          /\.js$/.test(module.resource) && (
            module.resource.indexOf(
              path.join(__dirname, '../node_modules/antd/')
            ) === 0
          )
        )
      }
    }),
    
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendorMoment',
      chunks: ['vendor'], // hash 文件更新以后：Uncaught (in promise) Error: Loading chunk 0 failed.
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) && (
            module.resource.indexOf(
              path.join(__dirname, '../node_modules/moment/')
            ) === 0
          )
        )
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendorReact',
      chunks: ['vendor'],
      minChunks: function (module, count) {
        return (
          module.resource &&
          /\.js$/.test(module.resource) && (
            module.resource.indexOf(
              path.join(__dirname, '../node_modules/react-redux')
            ) === 0
          )
        )
      }
    }),
    */
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      vendors: `<script type="text/javascript" src="${config.build.assetsPublicPath}vendors.dll.js"></script>`,
      vendorsReact: `<script type="text/javascript" src="${config.build.assetsPublicPath}vendorsReact.dll.js"></script>`,
      template: path.resolve(__dirname, '../src/index.html'),
      inject: true,
      // config.build.assetsPublicPath <- apiConfig['assetsPublicPathConfig']
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
    ]),
    
    extractCss,
    extractLib
    // new ExtractTextPlugin(utils.assetsPath('css/[name].css'))
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
