import React, { PropsWithChildren } from 'react';
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary';
import Error from 'js/pages/Error';

function ErrorFallback({ error }: FallbackProps) {
  const err = error as (Error & { status?: number }) | null;
  // The default error message here is not very helpful, but it prevents
  // crashes when the error is purposely triggered by the browser. In all
  // other situations `error` should be defined when we reach this.
  return (
    <Error
      errorCode={err?.status}
      isErrorBoundary
      errorBoundaryMessage={err?.message ?? 'The application experienced an error.'}
    />
  );
}

function ErrorBoundary({ children }: PropsWithChildren) {
  return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>;
}

export default ErrorBoundary;
