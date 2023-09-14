import React from 'react';
import Error from 'js/pages/Error';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import { faro } from '@grafana/faro-web-sdk';

function ErrorFallback({ error }) {
  return <Error isErrorBoundary errorBoundaryMessage={error.toString()} />;
}

function ErrorBoundary({ children }) {
  return (
    <SentryErrorBoundary
      beforeCapture={(scope) => {
        scope.setTag('location', 'main');
      }}
      onError={(error) => {
        faro.logError('ErrorBoundary', { error });
      }}
      fallback={ErrorFallback}
    >
      {children}
    </SentryErrorBoundary>
  );
}

export default ErrorBoundary;
