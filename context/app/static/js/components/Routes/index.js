/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import Routes from './Routes';
import ErrorBoundary from './ErrorBoundary';

function BoundedRoutes(props) {
  return (
    <ErrorBoundary>
      <Routes {...props} />
    </ErrorBoundary>
  );
}

export default BoundedRoutes;
