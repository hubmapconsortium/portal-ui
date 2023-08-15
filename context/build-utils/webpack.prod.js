/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

const common = require('./webpack.common');

const envConfig = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  },
  plugins: [
    new WebpackManifestPlugin(),
    new CompressionPlugin(),
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'hidive',
      project: 'portal-ui-react',
    }),
  ],
};

module.exports = merge(common, envConfig);
