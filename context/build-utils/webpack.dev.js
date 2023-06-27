/* eslint-disable import/no-extraneous-dependencies */
const { join } = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const envConfig = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/static/public/',
  },
  stats: 'minimal',
  devServer: {
    port: 5001,
    compress: true,
    static: join(__dirname, './app'),
    client: {
      // Disable overlay while testing error boundaries
      // The WDS overlay pops up even when error boundaries properly catch the runtime error
      // overlay: false,
    },
    // Proxy all requests to flask server except for files in static/public/
    proxy: {
      '!(/static/public//**/**.*)': {
        target: 'http://localhost:5000/',
      },
    },
  },
};

module.exports = merge(common, envConfig);
