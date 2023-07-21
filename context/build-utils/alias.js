// eslint-disable-next-line import/no-extraneous-dependencies
const { resolve } = require('path');

const alias = {
  'metadata-field-descriptions$': resolve('./ingest-validation-tools/docs/field-descriptions.yaml'),
  'metadata-field-types$': resolve('./ingest-validation-tools/docs/field-types.yaml'),
  'metadata-field-entities$': resolve('./ingest-validation-tools/docs/field-entities.yaml'),
  'metadata-field-assays$': resolve('./ingest-validation-tools/docs/field-assays.yaml'),
  js: resolve(__dirname, '../app/static/js/'),
  assets: resolve(__dirname, '../app/static/assets/'),
  'shared-styles': resolve(__dirname, '../app/static/js/shared-styles/'),
  package: resolve(__dirname, '../package.json'),
  'txml/txml': 'txml/dist/txml',
  '@mui/styled-engine': '@mui/styled-engine-sc'
};

exports.alias = alias;
