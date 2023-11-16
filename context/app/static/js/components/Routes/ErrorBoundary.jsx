import React from 'react';
import Error from 'js/pages/Error';
import { FaroErrorBoundary, faro } from '@grafana/faro-react';

function ErrorFallback(error) {
  // The default error message here is not very helpful,
  // but it prevents crashes when the error is purposely triggered by the browser.
  // In all other situations, `error` should be defined when we reach this.
  return (
    <Error
      errorCode={error?.status}
      isErrorBoundary
      errorBoundaryMessage={(error ?? 'The application experienced an error.').toString()}
    />
  );
}

function ErrorBoundary({ children }) {
  return (
    <FaroErrorBoundary
      fallback={ErrorFallback}
      beforeCapture={() =>
        faro.api.setView({
          name: 'Sitewide Error Boundary',
        })
      }
    >
      {children}
    </FaroErrorBoundary>
  );
}

export default ErrorBoundary;
