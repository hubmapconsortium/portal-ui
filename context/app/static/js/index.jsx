import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

// eslint-disable-next-line no-undef
const { validation_errors } = flaskData.entity.mapper_metadata;
if (validation_errors && validation_errors.length) {
  console.warn('Schema validation errors', validation_errors);
}

ReactDOM.render(
  // eslint-disable-next-line no-undef
  <App flaskData={flaskData} />,
  document.getElementById('react-content'),
);
