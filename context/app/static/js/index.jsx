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
  const shortDonorString = `${donor.sex}, ${donor.age_value} ${donor.age_unit} old`;
  const longDonorString = `${donor.height_value}${donor.height_unit}, ${donor.weight_value}${donor.weight_unit}, ${donor.race} ${shortDonorString}`;
  const assayOrganString = `${entity.mapped_data_types} of ${entity.origin_sample.mapped_organ}`;
  const medicalHistory = donor.medicalHistory ? `${donor.medicalHistory.join(', ')}` : 'no medical history';
  const name = `${assayOrganString} from ${shortDonorString}`;
  const fallbackDescription = `${assayOrganString} from ${longDonorString} with ${medicalHistory}`;

  return {
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    name,
    description: entity.description || fallbackDescription,
    creator: [
      {
        '@type': 'Person',
        // sameAs: 'http://orcid.org/0000-0000-0000-0001',
        name: entity.created_by_user_displayname,
      },
      {
        '@type': 'Organization',
        // TODO: sameAs: 'http://ror.org/xxxxxxxxx',
        name: entity.group_name,
      },
    ],
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
