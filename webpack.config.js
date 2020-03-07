const webpack = require('webpack');
const resolve = require('path').resolve;

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
        use: { loader: "svg-loader" },
      },
    ]
  }
};
module.exports = config;