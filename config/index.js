var path = require('path')

var apiConfig = require('../src/store/api.js');
const versionEnv = process.env.VERSION_ENV || 'dev';
const runEnv = process.env.RUN_ENV || 'build';
var assetsPublicPathConfig = apiConfig['assetsPublicPathConfig'];
if(versionEnv=='dev-local'||versionEnv=='sit-local'){
  assetsPublicPathConfig = 'http://historyroute.317hu.com/static/';
}

if(runEnv=='build'){
  console.log('静态资源目录：%s', assetsPublicPathConfig);
}

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, `../dist/index.html`),
    assetsRoot: path.resolve(__dirname, `../dist/static/`),
    assetsSubDirectory: 'assets',// static
    assetsPublicPath: assetsPublicPathConfig, // /static/
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8081,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static/assets/',
    assetsPublicPath: '/',
    proxyTable: {},
    cssSourceMap: false
  }
}
