/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { alias } = require('./alias');
const { HuBMAPGlobals } = require('./webpack.plugins');

const maintenancePath = './app/static/js/maintenance/';

const config = {
  mode: 'production',
  devtool: 'cheap-source-map',
  entry: { maintenance: `./app/static/js/maintenance/index.jsx` },
  output: {
    path: resolve('./app/static/js/maintenance/public'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.woff', '.woff2', '.svg', '.yaml', '.yml', '.html'],
    alias,
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: {
          loader: 'swc-loader',
          options: {
            sync: true,
            jsc: {
              target: 'es2019',
            },
          },
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
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '/fonts/[name].[ext]',
          },
        },
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
        type: 'json', // Required by Webpack v4
        use: 'yaml-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: `${maintenancePath}/index.html`, favicon: './app/static/favicon.ico' }),
    HuBMAPGlobals,
  ],
};

module.exports = config;
