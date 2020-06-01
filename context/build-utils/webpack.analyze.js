/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Visualizer = require('webpack-visualizer-plugin');
const common = require('./webpack.common');
const envConfig = require('./webpack.prod');

const addOns = {
  plugins: [
    new WebpackBundleAnalyzer({
      analyzerMode: 'static',
      reportFilename: './report.html',
      openAnalyzer: false,
    }),
    new Visualizer(),
  ],
};

module.exports = merge(common, envConfig, addOns);
