const webpack = require('webpack')
const library = '[name]'
const path = require('path')
var config = require('../config')
module.exports = {
  entry: {
    vendorsReact: ['react', 'redux'],
    // vendorsAntd: ['antd'],
    vendorsLib: [ 'moment', 'rc-calendar']
  },
  output: {
    filename: '[name].dll.js',
    path: config.build.assetsPublicPath,
    publicPath: config.build.assetsPublicPath,
    library
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, './dist/[name]-manifest.json'),
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
