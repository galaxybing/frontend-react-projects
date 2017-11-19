const path = require('path');
var join = path.join;
var resolve = path.resolve;
var existsSync = require('fs').existsSync;
var webpack = require('webpack');
// process.noDeprecation = true;
// 
// loaderUtils Warning:
//  https://github.com/webpack/loader-utils/issues/56
//  https://segmentfault.com/a/1190000010186847
process.traceDeprecation = true;

var utils = require('./utils')
var config = require('../config')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

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
    vendor: ['react', 'redux', 'react-redux', 'antd', 'moment' ], // 'lodash' 'moment', 'rc-calendar'  
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
    new webpack.EnvironmentPlugin({
      VERSION_ENV: 'dev'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        query: {
            presets: ['es2015','stage-2', 'react']
        },
        include: [resolve('lib_modules'), resolve('src'), resolve('test'), resolve('examples')] // include: path.join(__dirname, './src')
      },
      {
        test: /([^/]+)\/?([^/]*)\.(js|jsx)?$/,
        use: [
            'bundle-loader?lazy&name=[name]',
            'babel-loader?presets=es2015&presets=stage-2&presets=react',
        ],
        include: [path.resolve(__dirname, '../src/views/routes/'), resolve('./examples/v2.0.1/views/routes/')],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        },
        include: [resolve('src'), resolve('examples')],
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
