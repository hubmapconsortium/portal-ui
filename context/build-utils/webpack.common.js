const { resolve } = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  entry: './app/static/js/index.jsx',
  output: {
    path: resolve('./app/static/public'),
    filename: 'bundle.js',
    publicPath: resolve('../app/static/public'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.woff', '.woff2', '.svg', '.yaml', '.yml'],
    alias: {
      'metadata-field-descriptions$': resolve('./ingest-validation-tools/docs/field-descriptions.yaml'),
      helpers: resolve(__dirname, '../app/static/js/helpers/'),
      images: resolve(__dirname, '../app/static/images/'),
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
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
