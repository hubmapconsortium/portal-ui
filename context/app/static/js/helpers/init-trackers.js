import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { LogLevel, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';

/**
 * Initialize Faro trackers
 * This function should be used in the main `index.jsx` before the app is rendered.
 */
function initTrackers() {
  const version = `portal-ui-react@${PACKAGE_VERSION}`;
  // sentryEnv is globally defined in the index.html templates for both `maintenance` and non-maintenance pages
  const environment = sentryEnv;
  const paused = !['prod', 'prod-stage'].includes(environment);

  initializeFaro({
    url: 'https://faro-collector-prod-us-east-0.grafana.net/collect/77a0efade67edd876ae6c63ebb2d825c',
    app: {
      name: 'hubmap-data-portal',
      version,
      environment,
      paused,
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
