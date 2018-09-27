var path = require('path')
var boz = require('../src/store/api.js');
var assetsPublicPathConfig = boz['assetsPublicPathConfig'];
if(boz['RUN_ENV'] === 'build' && assetsPublicPathConfig) {
  console.log('静态资源目录：%s', assetsPublicPathConfig);
}

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist/static/'),
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
    assetsSubDirectory: '/static/',
    assetsPublicPath: '/',
    proxyTable: {},
    cssSourceMap: false
  },
  BOZ: boz,
}
