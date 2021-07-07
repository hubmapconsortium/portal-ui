import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { Alert } from 'js/shared-styles/alerts';

import RouteLoader from '../RouteLoader';
import useSendWebVitals from '../useSendWebVitals';
import { StyledContainer, MainWrapper } from './style';

function Route({ children, disableWidthConstraint }) {
  const constrainWidthProps = disableWidthConstraint ? { maxWidth: false, disableGutters: true } : { maxWidth: 'lg' };

  useSendWebVitals();

  return (
    <Suspense fallback={<RouteLoader />}>
      <MainWrapper>
        <StyledContainer {...constrainWidthProps}>
          <Alert severity="warning">Hey!!!</Alert>
          {children}
        </StyledContainer>
      </MainWrapper>
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
