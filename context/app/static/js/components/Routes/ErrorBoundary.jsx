import React from 'react';
import Error from 'js/pages/Error';
import * as Sentry from '@sentry/react';

function ErrorFallback({ error }) {
  return <Error isErrorBoundary errorBoundaryMessage={error.toString()} />;
}

function ErrorBoundary({ children }) {
  return (
    <Sentry.ErrorBoundary
      beforeCapture={(scope) => {
        scope.setTag('location', 'main');
      }}
      fallback={ErrorFallback}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}

export default ErrorBoundary;
