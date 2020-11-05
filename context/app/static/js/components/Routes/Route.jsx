import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

const StyledContainer = styled(Container)`
  margin-top: ${(props) => props.theme.spacing(2)}px;
  flex-grow: 1;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-grow: 1;
`;

function Route({ children, disableWidthConstraint }) {
  const constrainWidthProps = disableWidthConstraint ? { maxWidth: false, disableGutters: true } : { maxWidth: 'lg' };

  return (
    <Suspense
      fallback={
        <LoadingWrapper>
          <CircularProgress />
        </LoadingWrapper>
      }
    >
      <StyledContainer {...constrainWidthProps}>{children}</StyledContainer>{' '}
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
