const webpack = require('webpack')
const library = '[name]'
const path = require('path')
var config = require('../config')
module.exports = {
  entry: {
    vendors: ['moment', 'echarts'],
    vendorsReact: ['rc-calendar', 'react', 'redux', 'react-redux', 'antd'],
    vendorsRaven: ['raven-js', '@317hu/GlobalRavenCaptureException'],
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dist' + config.build.assetsPublicPath),
    publicPath: path.resolve(__dirname, '../dist' + config.build.assetsPublicPath), // 
    library
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../dist/[name]-manifest.json'),
      // This must match the output.library option above
      name: library
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        drop_debugger: true
      },
      sourceMap: false
    }),
  ],
}
