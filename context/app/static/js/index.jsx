import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import Iframe from './pages/Iframe';
import { setJsonLD } from './schema.org';

// TODO: Re-enable. https://github.com/hubmapconsortium/portal-ui/issues/1426
// eslint-disable-next-line no-undef
// const validation_errors = flaskData.entity?.mapper_metadata?.validation_errors;
// if (validation_errors && validation_errors.length) {
//   console.warn('Schema validation errors', validation_errors);
// }

ReactDOM.render(
  // eslint-disable-next-line no-undef
  window.location.pathname.startsWith('/iframe/') ? <Iframe flaskData={flaskData} /> : <App flaskData={flaskData} />,
  document.getElementById('react-content'),
);

/* eslint-disable no-undef */
if (flaskData?.entity?.entity_type === 'Dataset') {
  setJsonLD(flaskData.entity);
}
/* eslint-enable */
