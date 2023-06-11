/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const ManifestPlugin = require('webpack-manifest-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const common = require('./webpack.common');

const envConfig = {
  mode: 'production',
  devtool: 'cheap-source-map',
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
  },
  plugins: [new ManifestPlugin(), new CompressionPlugin()],
};

module.exports = merge(common, envConfig);
