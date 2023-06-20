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
  },
  devServer: {
    contentBase: join(__dirname, './app'),
    publicPath: '/static/public/',
    port: 5001,
    compress: true,
    stats: 'minimal',
    // Proxy all requests to flask server except for files in static/public/
    proxy: {
      '!(/static/public//**/**.*)': {
        target: 'http://localhost:5000/',
      },
    },
  },
};

module.exports = merge(common, envConfig);
