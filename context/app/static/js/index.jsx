import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

ReactDOM.render(
  // eslint-disable-next-line no-undef
  <App flaskData={flaskData} />,
  document.getElementById('react-content'),
);

function getDatasetLD(entity) {
  const donor = entity.donor.mapped_metadata;
  const donorString = `${donor.sex}, ${donor.age_value} ${donor.age_unit} old`;
  return {
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    name: `${entity.mapped_data_types} of ${entity.origin_sample.mapped_organ} from ${donorString}`,
    description: entity.description,
  };
}

function setJsonLD(ld) {
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(ld, null, 2);
  document.head.appendChild(script);
}

/* eslint-disable no-undef */
if (flaskData?.entity?.entity_type === 'Dataset') {
  setJsonLD(getDatasetLD(flaskData.entity));
}
/* eslint-enable */
