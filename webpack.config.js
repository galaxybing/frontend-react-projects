var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    './index.js'
  ],
  output: {
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  /* 直接在 package.json 里面配置 --inline --hot，所以这里不需要添加插件
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  */
  module: {
    rules: [{
      test: /\.js[x]?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015','stage-2', 'react']
      },
      include: path.join(__dirname, '.')
    }]
  }
};
