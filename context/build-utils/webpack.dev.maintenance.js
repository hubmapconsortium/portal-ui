/* eslint-disable import/no-extraneous-dependencies */
const { join } = require('path');
const { merge } = require('webpack-merge');
const maintenance = require('./webpack.maintenance');

const envConfig = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  stats: 'minimal',
  devServer: {
    contentBase: join(__dirname, '../app/static/js/maintenance/public/'),
    publicPath: '/',
    port: 5002,
    compress: true,
  },
};

module.exports = merge(maintenance, envConfig);
