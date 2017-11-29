var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

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

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        test: /(\.css|\.less)$/, include: [resolve('src/components'), resolve('src/views/'), resolve(`examples/v${examplesVersion}/views/`)], 
        use: [
          {
            loader: 'style-loader'
          },
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
          },
          {
          loader: "less-loader"
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: process.env.NODE_ENV === 'production' ? (loader) => [require('postcss-import')({ root: loader.resourcePath }), require('autoprefixer')(),] : []
            }
          }
        ]
      },
      {
        test: /(\.css|\.less)$/, exclude: [resolve('src/components'), resolve('src/views/'), resolve(`examples/v${examplesVersion}/views/`)],
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: "css-loader",
            options: {
              modules: false,
              url: true,
              minimize: process.env.NODE_ENV === 'production',
              sourceMap: config.build.productionSourceMap,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            }
          },
          {
            loader: "less-loader",
            options: {
              modifyVars: theme // 使用了 antd 的全局样式配置时，.babelrc 仅支持 import 导入 "style": true
                                // ["import", { "libraryName": "antd", "style": true, "comment": "true for .less, css for .css"}]
            }
          }
        ]
      },
    ]
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.html'),
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
