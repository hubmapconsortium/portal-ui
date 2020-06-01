/* eslint-disable import/no-extraneous-dependencies */
const { join } = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common');

const envConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: join(__dirname, './app'),
    publicPath: '/static/public/',
    port: 5001,
    compress: true,
    stats: 'minimal',
    proxy: {
      '!(/static/public//**/**.*)': {
        target: 'http://localhost:5000/',
      },
    },
  },
};

module.exports = merge(common, envConfig);
