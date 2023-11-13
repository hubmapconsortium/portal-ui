const { resolve } = require('path');

const { alias } = require('./alias');
const { HuBMAPGlobals } = require('./webpack.plugins');

const config = {
  entry: { main: './app/static/js/index.jsx' },
  output: {
    path: resolve('./app/static/public'),
    publicPath: `${resolve('/static/public/')}/`,
    clean: true,
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
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.woff', '.woff2', '.svg', '.yaml', '.yml', '.json'],
    alias,
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            sync: true,
            jsc: {
              target: 'es2019',
            },
          },
        },
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
        type: 'asset/inline',
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
  plugins: [HuBMAPGlobals],
};

module.exports = config;
