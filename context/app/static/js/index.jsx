import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import { setJsonLD } from './schema.org';

ReactDOM.render(
  // eslint-disable-next-line no-undef
  <App flaskData={flaskData} />,
  document.getElementById('react-content'),
);

/* eslint-disable no-undef */
if (flaskData?.entity?.entity_type === 'Dataset') {
  setJsonLD(flaskData.entity);
}
/* eslint-enable */
