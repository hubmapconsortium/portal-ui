import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { LogLevel, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { ReactIntegration } from '@grafana/faro-react';

import { getUserGroups, getUserType } from './trackers';

/**
 * Initialize Faro trackers
 * This function should be used in the main `index.jsx` before the app is rendered.
 */
function initTrackers() {
  const version = `portal-ui-react@${PACKAGE_VERSION}`;
  const environment = sentryEnv;
  const shouldReport = ['prod', 'prod-test'].includes(environment);

  initializeFaro({
    url: 'https://faro-collector-prod-us-east-0.grafana.net/collect/77a0efade67edd876ae6c63ebb2d825c',
    app: {
      name: 'hubmap-data-portal',
      version,
      environment,
    },
    beforeSend(item) {
      if (shouldReport) {
        return item;
      }
      return null;
    },
    user: {
      attributes: {
        userType: getUserType(),
        userGroups: getUserGroups(),
      },
    },
    instrumentations: [
      // Mandatory, overwriting the instrumentations array would cause the default instrumentations to be omitted
      ...getWebInstrumentations({
        captureConsole: true,
        capturePerformanceTimeline: true,
        // Only capture errors and warnings in grafana
        captureConsoleDisabledLevels: [LogLevel.INFO, LogLevel.DEBUG, LogLevel.LOG],
      }),

      // Initialization of the tracing package.
      // This packages is optional because it increases the bundle size noticeably. Only add it if you want tracing data.
      new TracingInstrumentation(),
      new ReactIntegration(),
    ],
  });
}

export default initTrackers;
