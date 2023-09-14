import { init as sentryInit } from '@sentry/react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { LogLevel, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';

/**
 * Initialize Faro and Sentry tracking
 * This function should be used in the main `index.jsx` before the app is rendered.
 */
function initTrackers() {
  const release = `portal-ui-react@${PACKAGE_VERSION}`;
  const enableTracking = ['prod', 'prod-stage'].includes(sentryEnv);

  sentryInit({
    dsn: sentryDsn,
    environment: sentryEnv,
    enabled: enableTracking,
    release,
  });

  initializeFaro({
    url: 'https://faro-collector-prod-us-east-0.grafana.net/collect/77a0efade67edd876ae6c63ebb2d825c',
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
}

export default initTrackers;
