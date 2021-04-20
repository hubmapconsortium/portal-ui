/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const maintenancePath = './app/static/js/maintenance/';

const config = {
  mode: 'production',
  devtool: 'cheap-source-map',
  entry: { maintenance: `./app/static/js/maintenance/index.jsx` },
  output: {
    path: resolve('./app/static/js/maintenance/public'),
    publicPath: `/`,
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.woff', '.woff2', '.svg', '.yaml', '.yml', '.html'],
    alias: {
      'metadata-field-descriptions$': resolve('./ingest-validation-tools/docs/field-descriptions.yaml'),
      js: resolve(__dirname, '../app/static/js/'),
      'portal-images': resolve(__dirname, '../app/static/portal-images/'),
      'shared-styles': resolve(__dirname, '../app/static/js/shared-styles/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
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
        use: { loader: '@svgr/webpack' },
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
    new CleanWebpackPlugin(),
  ],
};

module.exports = config;
