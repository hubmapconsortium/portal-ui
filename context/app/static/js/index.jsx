import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App';
import Iframe from './pages/Iframe';
import initTrackers from './helpers/init-trackers';
import { setJsonLD } from './schema.org';

// TODO: Re-enable. https://github.com/hubmapconsortium/portal-ui/issues/1426

// const validation_errors = flaskData.entity?.mapper_metadata?.validation_errors;
// if (validation_errors && validation_errors.length) {
//   console.warn('Schema validation errors', validation_errors);
// }

initTrackers();

const root = ReactDOM.createRoot(document.getElementById('react-content'));
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
