// eslint-disable-next-line import/no-extraneous-dependencies
const { resolve } = require('path');

const alias = {
  js: resolve(__dirname, '../app/static/js/'),
  assets: resolve(__dirname, '../app/static/assets/'),
  'shared-styles': resolve(__dirname, '../app/static/js/shared-styles/'),
  package: resolve(__dirname, '../package.json'),
  'txml/txml': 'txml/dist/txml',
  '@mui/styled-engine': '@mui/styled-engine-sc',
};

exports.alias = alias;
