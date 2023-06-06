import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';
import Iframe from './pages/Iframe';
import { setJsonLD } from './schema.org';

// eslint-disable-next-line import/no-extraneous-dependencies
import '@fontsource-variable/inter/index.css';

// TODO: Re-enable. https://github.com/hubmapconsortium/portal-ui/issues/1426
// eslint-disable-next-line no-undef
// const validation_errors = flaskData.entity?.mapper_metadata?.validation_errors;
// if (validation_errors && validation_errors.length) {
//   console.warn('Schema validation errors', validation_errors);
// }

const container = document.getElementById('react-content');

const root = createRoot(container);

/* eslint-disable no-undef */
root.render(
  window.location.pathname.startsWith('/iframe/') ? (
    <Iframe flaskData={flaskData} />
  ) : (
    <App
      flaskData={flaskData}
      groupsToken={groupsToken}
      isAuthenticated={isAuthenticated}
      userEmail={userEmail}
      workspacesToken={workspacesToken}
      userGroups={userGroups}
    />
  ),
);

if (flaskData?.entity?.entity_type === 'Dataset') {
  setJsonLD(flaskData.entity);
}
/* eslint-enable */
