const { resolve } = require('path');

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
      'search-schema-definitions$': resolve('./search-schema/data/definitions.yaml'),
      'metadata-field-descriptions$': resolve('./ingest-validation-tools/docs/field-descriptions.yaml'),
    }
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
      {
        test: /\.ya?ml$/,
        type: 'json', // Required by Webpack v4
        use: 'yaml-loader'
      }
    ],
  },
};
module.exports = (env, argv) => {
  return argv.mode === 'development' ? { ...config, devtool: 'nosources-source-map' } : { ...config, devtool: 'cheap-source-map' }
};
