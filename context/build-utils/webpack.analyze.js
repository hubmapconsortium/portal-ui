/* eslint-disable import/no-extraneous-dependencies */
const { mergeWithCustomize, unique } = require('webpack-merge');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Visualizer = require('webpack-visualizer-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const envConfig = require('./webpack.prod');

const addOns = {
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!mockServiceWorker.js'] }),
    new WebpackBundleAnalyzer({
      analyzerMode: 'static',
      reportFilename: './report.html',
      openAnalyzer: false,
    }),
    new Visualizer(),
  ],
};

module.exports = mergeWithCustomize({
  customizeArray: unique('plugins', ['CleanWebpackPlugin'], (plugin) => plugin.constructor && plugin.constructor.name),
})(envConfig, addOns);
