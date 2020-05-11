const webpack = require('webpack');
const dotenv = require('dotenv');
const { resolve } = require('path');

const fileEnv = dotenv.config({ path: './instance/app.conf' }).parsed;

const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
  // eslint-disable-next-line no-param-reassign
  prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
  return prev;
}, {});

const config = {
  entry: './app/static/js/index.jsx',
  output: {
    path: resolve('./app/static/public'),
    filename: 'bundle.js',
    publicPath: resolve('../app/static/public'),
  },
  devtool: 'nosources-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.woff', '.woff2', '.svg'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitError: true,
          emitWarning: true,
          configFile: './.eslintrc.yml',
        },
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.jsx?/,
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
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
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
    ],
  },
  plugins: [
    new webpack.DefinePlugin(envKeys),
  ],
};
module.exports = config;
