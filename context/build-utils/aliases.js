// eslint-disable-next-line import/no-extraneous-dependencies
const { resolve } = require('path');

const aliases = {
  'metadata-field-descriptions$': resolve('./ingest-validation-tools/docs/field-descriptions.yaml'),
  js: resolve(__dirname, '../app/static/js/'),
  'portal-images': resolve(__dirname, '../app/static/portal-images/'),
  'shared-styles': resolve(__dirname, '../app/static/js/shared-styles/'),
  package: resolve(__dirname, '../package.json'),
};

exports.aliases = aliases;
