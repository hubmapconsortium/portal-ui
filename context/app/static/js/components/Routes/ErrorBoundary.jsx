import React from 'react';
import Error from 'js/pages/Error';
import { FaroErrorBoundary } from '@grafana/faro-react';

function ErrorFallback(error) {
  return <Error isErrorBoundary errorBoundaryMessage={(error ?? 'Missing error message.').toString()} />;
}

function ErrorBoundary({ children }) {
  return <FaroErrorBoundary fallback={ErrorFallback}>{children}</FaroErrorBoundary>;
}

export default ErrorBoundary;
