import React from 'react';
import ReactDOM from 'react-dom';
import { init as sentryInit } from '@sentry/react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { LogLevel, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';

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
const enableTracking = ['prod', 'prod-stage'].includes(sentryEnv);

sentryInit({
  dsn: sentryDsn,
  environment: sentryEnv,
  enabled: enableTracking,
  release,
});

initializeFaro({
  url: faroCollectorUrl,
  app: {
    name: 'hubmap-data-portal',
    version: release,
    environment: sentryEnv,
    paused: !enableTracking,
  },
  instrumentations: [
    // Mandatory, overwriting the instrumentations array would cause the default instrumentations to be omitted
    ...getWebInstrumentations({
      captureConsole: true,
      capturePerformanceTimeline: true,
      captureConsoleDisabledLevels: [LogLevel.INFO, LogLevel.DEBUG],
    }),

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
