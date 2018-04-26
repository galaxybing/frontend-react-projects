const webpack = require('webpack')
const library = '[name]'
const path = require('path')
var config = require('../config')
module.exports = {
  entry: {
    // vendors: ['moment', 'rc-calendar', 'echarts'],
    vendors: ['moment', 'rc-calendar', 'redux', 'react-redux', 'antd', 'react','react-dom'],
    // vendorsReact: ['redux', 'react-redux', 'antd', 'react','react-dom']
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
