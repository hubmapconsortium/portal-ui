const { resolve } = require('path');

// Force React and ReactDOM to always resolve to our copy.
// Without this, a linked library can drag in its own
// `node_modules/react`, which both duplicates React in the bundle and — if the
// versions differ across majors — produces "Objects are not valid as a React
// child" errors because element `$$typeof` Symbols differ between copies.
const reactRoot = resolve(__dirname, '../node_modules/react');
const reactDomRoot = resolve(__dirname, '../node_modules/react-dom');

const alias = {
  js: resolve(__dirname, '../app/static/js/'),
  assets: resolve(__dirname, '../app/static/assets/'),
  'shared-styles': resolve(__dirname, '../app/static/js/shared-styles/'),
  package: resolve(__dirname, '../package.json'),
  'txml/txml': 'txml/dist/txml',
  '@mui/styled-engine': '@mui/styled-engine-sc',
  react$: reactRoot,
  'react/jsx-runtime': resolve(reactRoot, 'jsx-runtime'),
  'react/jsx-dev-runtime': resolve(reactRoot, 'jsx-dev-runtime'),
  'react-dom$': reactDomRoot,
  'react-dom/client': resolve(reactDomRoot, 'client'),
};

exports.alias = alias;
