var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-source-map',
  entry: './docs/index.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true
      }
    }),
    new webpack.BannerPlugin('This file is created by wwwy3y3. Built time: ' + // eslint-disable-line max-len
      new Date())
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: path.resolve(__dirname, "node_modules")
      }
    ]
  }
};
