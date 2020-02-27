const webpack = require('webpack');
const resolve = require('path').resolve;

const config = {
  entry: './context/app/static/js/index.jsx',
  output:{
    path: resolve('../context/app/static/public'),
    filename: 'bundle.js',
    publicPath: resolve('../context/app/static/public'),
  },
  resolve: {
    extensions: ['.js','.jsx','.css']
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }]
  }
};
module.exports = config;