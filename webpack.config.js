const webpack = require('webpack');
const resolve = require('path').resolve;
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const config = {
  entry: './context/app/static/js/index.jsx',
  output:{
    path: resolve('../context/app/static/public'),
    filename: 'bundle.js',
    publicPath: resolve('../context/app/static/public'),
  },
  resolve: {
    extensions: ['.js','.jsx','.css', '.woff', '.woff2', '.svg']
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
          configFile: "./.eslintrc.yml"
        }
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
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "/fonts/[name].[ext]",
          },
        },
      },
      {
        test: /\.svg$/,
        use: { loader: "@svgr/webpack" },
      },
    ]
  },
  // plugins: [
  //   new FaviconsWebpackPlugin('./context/app/static/favicon.ico')
  // ]
};
module.exports = config;
