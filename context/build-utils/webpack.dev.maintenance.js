/* eslint-disable import/no-extraneous-dependencies */
const { join } = require('path');
const { merge } = require('webpack-merge');
const maintenance = require('./webpack.maintenance');

const envConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: join(__dirname, '../app/static/js/maintenance/public/'),
    // publicPath: '/',
    port: 5002,
    compress: true,
    // stats: 'minimal',
  },
};

module.exports = merge(maintenance, envConfig);
