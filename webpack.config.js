var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin= require("extract-text-webpack-plugin");
var loadersCss= ["style-loader", "css-loader"];
if(process.env.NODE_ENV==="production"){
    loadersCss= ExtractTextPlugin.extract(...loadersCss);
}else{
    loadersCss= loadersCss.join("!");
}

module.exports = {
  entry: {
      index: "./src/js/index.js",
      vendor: ['./src/js/core/flex.js', 'gsap'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: "./static/",
    filename: "./js/[name].js",
  },
  plugins: [
      new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          filename: './js/libs/vendor.js',
          minChunks: Infinity,
      })
  ],
  /* 直接在 package.json 里面配置 --inline --hot，所以这里不需要添加插件
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  */
  module: {
    rules: [
        {test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader', query: {presets: ['es2015','stage-2', 'react']}, include: path.join(__dirname, './src/js')},
        { test: /\.css?$/, include: path.join(__dirname, "src/css/"), loader: loadersCss },
    ]
  }
};
