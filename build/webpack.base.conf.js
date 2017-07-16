var path = require('path')
var utils = require('./utils')
var config = require('../config')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCss = new ExtractTextPlugin({
  filename: utils.assetsPath('css/[name].[contenthash].css'),
  disable: process.env.NODE_ENV === "development"
});
const extractAntd = new ExtractTextPlugin({
  filename: utils.assetsPath('css/antd.[contenthash].css'),
  disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: {
    app: './src/js/index.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  plugins: [
    extractCss,
    extractAntd,
  ],
  module: {
    rules: [
      
      {test: /(\.css|\.less)$/, include: [resolve('src/js/components')], use: extractCss.extract({
                use: [{
                    loader: "css-loader",
                    options: {
                      modules: true,
                      url: false,
                      minimize: process.env.NODE_ENV === 'production',
                      sourceMap: config.build.productionSourceMap,
                      localIdentName: '[name]__[local]___[hash:base64:5]',
                    }
                }, {
                    loader: "less-loader"
                }],
                fallback: "style-loader"
            })},
      {test: /(\.css|\.less)$/, exclude: [resolve('src/js/components')], use: extractAntd.extract({
                use: [{
                    loader: "css-loader",
                    options: {
                      modules: false,
                      url: false,
                      minimize: process.env.NODE_ENV === 'production',
                      sourceMap: config.build.productionSourceMap,
                      localIdentName: '[name]__[local]___[hash:base64:5]',
                    }
                }, {
                    loader: "less-loader"
                }],
                fallback: "style-loader"
            })},
      
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        query: {
            presets: ['es2015','stage-2', 'react']
        },
        exclude: /node_modules/,
        include: [resolve('src'), resolve('test')] // include: path.join(__dirname, './src/js')
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        },
        include: [resolve('src')],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
