import React from 'react';
import ReactDOM from 'react-dom';
import { init as sentryInit } from '@sentry/react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';

import App from './components/App';
import Iframe from './pages/Iframe';
import { setJsonLD } from './schema.org';

// TODO: Re-enable. https://github.com/hubmapconsortium/portal-ui/issues/1426
// eslint-disable-next-line no-undef
// const validation_errors = flaskData.entity?.mapper_metadata?.validation_errors;
// if (validation_errors && validation_errors.length) {
//   console.warn('Schema validation errors', validation_errors);
// }

const release = `portal-ui-react@${PACKAGE_VERSION}`;

sentryInit({
  dsn: sentryDsn,
  environment: sentryEnv,
  enabled: ['prod', 'prod-stage'].includes(sentryEnv),
  release,
});

initializeFaro({
  url: faroUrl,
  app: {
    name: 'hubmap-data-portal',
    version: release,
    environment: 'production',
  },
  instrumentations: [
    // Mandatory, overwriting the instrumentations array would cause the default instrumentations to be omitted
    ...getWebInstrumentations(),

    // Initialization of the tracing package.
    // This packages is optional because it increases the bundle size noticeably. Only add it if you want tracing data.
    new TracingInstrumentation(),
  ],
});

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
