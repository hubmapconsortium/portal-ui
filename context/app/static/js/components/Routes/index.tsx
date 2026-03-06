import React from 'react';
import Routes from './Routes';
import ErrorBoundary from './ErrorBoundary';

function BoundedRoutes(props: { flaskData: FlaskData }) {
  return (
    <ErrorBoundary>
      <Routes {...props} />
    </ErrorBoundary>
  );
}

export default BoundedRoutes;
