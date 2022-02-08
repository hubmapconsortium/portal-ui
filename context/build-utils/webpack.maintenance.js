/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common');

const maintenancePath = './app/static/js/maintenance/';

const envConfig = {
  mode: 'production',
  devtool: 'cheap-source-map',
  entry: { maintenance: `./app/static/js/maintenance/index.jsx` },
  output: {
    path: resolve('./app/static/js/maintenance/public'),
    publicPath: `/`,
    filename: '[name].bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({ template: `${maintenancePath}/index.html`, favicon: './app/static/favicon.ico' }),
    new CleanWebpackPlugin(),
  ],
};

module.exports = merge(common, envConfig);
