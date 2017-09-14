const path = require('path');
var join = path.join;
var resolve = path.resolve;
var existsSync = require('fs').existsSync;
var webpack = require('webpack')
var utils = require('./utils')
var config = require('../config')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCss = new ExtractTextPlugin({
  filename: utils.assetsPath('css/[name].css'),
  disable: process.env.NODE_ENV === "development"
});
const extractLib = new ExtractTextPlugin({
  filename: utils.assetsPath('css/lib-[name].css'),
  disable: process.env.NODE_ENV === "development"
});

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

module.exports = {
  entry: {
    app: './src/index.js',
    vendorLib: ['react', 'redux','antd', 'moment', 'rc-calendar' ] // 'lodash'
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
    extractLib,
    new webpack.EnvironmentPlugin({
      VERSION_ENV: 'dev'
    })
  ],
  module: {
    rules: [
      
      {/* 自定义的组件，样式 css-modules 化？？如果需要使用其他的 css 预编译程序，则可以去除以下两条配置 */
        test: /(\.css|\.less)$/, include: [resolve('src/components'), resolve('src/views/')], use: extractCss.extract({
          use: [{
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
          }],
          fallback: "style-loader"
        })
      },
      {
        test: /(\.css|\.less)$/, exclude: [resolve('src/components'), resolve('src/views/')], use: extractLib.extract({
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
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        query: {
            presets: ['es2015','stage-2', 'react']
        },
        exclude: /node_modules/,
        include: [resolve('src'), resolve('test')] // include: path.join(__dirname, './src')
      },
      {
        test: /([^/]+)\/?([^/]*)\.(js|jsx)?$/,
        use: [
            'bundle-loader?lazy&name=[name]',
            'babel-loader?presets=es2015&presets=stage-2&presets=react',
        ],
        include: path.resolve(__dirname, '../src/views/routes/'),
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
