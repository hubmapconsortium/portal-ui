/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  entry: { main: './app/static/js/index.jsx' },
  output: {
    path: resolve('./app/static/public'),
    publicPath: `${resolve('/static/public/')}/`,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: RegExp('/node_modules/'),
          name: 'vendors',
          chunks: 'initial',
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.woff', '.woff2', '.svg', '.yaml', '.yml'],
    alias: {
      'metadata-field-descriptions$': resolve('./ingest-validation-tools/docs/field-descriptions.yaml'),
      js: resolve(__dirname, '../app/static/js/'),
      images: resolve(__dirname, '../app/static/images/'),
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
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
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
  plugins: [new CleanWebpackPlugin()],
};

module.exports = config;
