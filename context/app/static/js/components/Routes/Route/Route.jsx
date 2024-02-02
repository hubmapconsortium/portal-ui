import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import RouteLoader from '../RouteLoader';
import { StyledContainer } from './style';

function Route({ children, disableWidthConstraint }) {
  const constrainWidthProps = disableWidthConstraint ? { maxWidth: false, disableGutters: true } : { maxWidth: 'lg' };

  return (
    <Suspense fallback={<RouteLoader />}>
      <StyledContainer {...constrainWidthProps}>{children}</StyledContainer>
    </Suspense>
  );
}

Route.propTypes = {
  disableWidthConstraint: PropTypes.bool,
};

Route.defaultProps = {
  disableWidthConstraint: false,
};

export default Route;
