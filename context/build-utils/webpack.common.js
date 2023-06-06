/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { alias } = require('./alias');

const config = {
  entry: { main: './app/static/js/index.jsx' },
  output: {
    path: resolve('./app/static/public'),
    publicPath: `${resolve('/static/public/')}/`,
  },
  stats: {
    preset: 'minimal',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /\/node_modules\//,
          name: 'vendors',
          chunks: 'initial',
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.woff', '.woff2', '.svg', '.yaml', '.yml', '.json'],
    alias,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
        exclude: [/node_modules\/lineupjsx?/, /node_modules\/@datapunt?/],
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{ loader: 'url-loader' }],
      },
      {
        test: /\.ya?ml$/,
        use: 'yaml-loader',
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      // update globals in eslintrc to fix undefined errors
      CDN_URL: JSON.stringify('https://d3evp8qu4tjncp.cloudfront.net'),
    }),
  ],
};

module.exports = config;
