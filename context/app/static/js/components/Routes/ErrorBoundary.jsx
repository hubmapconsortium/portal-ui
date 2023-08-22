import React from 'react';
import Error from 'js/pages/Error';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';

function ErrorFallback({ error }) {
  return <Error isErrorBoundary errorBoundaryMessage={error.toString()} />;
}

function ErrorBoundary({ children }) {
  return (
    <SentryErrorBoundary
      beforeCapture={(scope) => {
        scope.setTag('location', 'main');
      }}
      fallback={ErrorFallback}
    >
      {children}
    </SentryErrorBoundary>
  );
}

export default ErrorBoundary;
