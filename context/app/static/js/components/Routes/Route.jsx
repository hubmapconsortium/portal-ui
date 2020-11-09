import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';

import RouteLoader from './RouteLoader';

const StyledContainer = styled(Container)`
  margin-top: ${(props) => props.theme.spacing(2)}px;
`;

const MainWrapper = styled.div`
  flex-grow: 1;
`;

function Route({ children, disableWidthConstraint }) {
  const constrainWidthProps = disableWidthConstraint ? { maxWidth: false, disableGutters: true } : { maxWidth: 'lg' };

  return (
    <Suspense fallback={<RouteLoader />}>
      <MainWrapper>
        <StyledContainer {...constrainWidthProps}>{children}</StyledContainer>
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
