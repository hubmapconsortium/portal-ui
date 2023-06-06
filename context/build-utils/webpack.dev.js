/* eslint-disable import/no-extraneous-dependencies */
const { join } = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const envConfig = {
  mode: 'development',
  devtool: 'eval-source-map',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/static/public/',
  },
  devServer: {
    static: join(__dirname, './app'),
    port: 5001,
    compress: true,
    // Proxy all requests to flask server except for files in static/public/
    proxy: {
      '!(/static/public//**/**.*)': {
        target: 'http://localhost:5000/',
      },
    },
  },
};

module.exports = merge(common, envConfig);
