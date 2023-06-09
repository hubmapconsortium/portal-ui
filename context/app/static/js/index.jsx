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

// Define global values for eslint https://eslint.org/docs/latest/use/configure/language-options#specifying-globals
// Since they're propagated into a context from here, we don't need to define them in every file/in the main config
/* global flaskData, groupsToken, isAuthenticated, userEmail, workspacesToken, userGroups */
ReactDOM.render(
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
  document.getElementById('react-content'),
);

if (flaskData?.entity?.entity_type === 'Dataset') {
  setJsonLD(flaskData.entity);
}
