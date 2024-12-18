const { DefinePlugin } = require('webpack');
const packageJSON = require('../package.json');

// Add corresponding entries to 'eslint.config.mjs' globals object when adding new globals
const HuBMAPGlobals = new DefinePlugin({
  CDN_URL: JSON.stringify('https://d3evp8qu4tjncp.cloudfront.net'),
  PACKAGE_VERSION: JSON.stringify(packageJSON.version),
});

module.exports = {
  HuBMAPGlobals,
};
