/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const envConfig = {
  mode: 'production',
  devtool: 'cheap-source-map',
};

module.exports = merge(common, envConfig);
