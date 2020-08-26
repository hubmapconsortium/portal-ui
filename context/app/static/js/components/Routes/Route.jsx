import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';

const StyledContainer = styled(Container)`
  margin-top: ${(props) => (props.$disableMarginTop ? 0 : props.theme.spacing(2))}px;
`;

function Route({ children, disableMarginTop, disableWidthConstraint }) {
  const constrainWidthProps = disableWidthConstraint ? { maxWidth: false, disableGutters: true } : { maxWidth: 'lg' };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <StyledContainer $disableMarginTop={disableMarginTop} {...constrainWidthProps}>
      {children}
    </StyledContainer>
  );
}

Route.propTypes = {
  disableMarginTop: PropTypes.bool,
  disableWidthConstraint: PropTypes.bool,
};

Route.defaultProps = {
  disableMarginTop: false,
  disableWidthConstraint: false,
};

export default Route;
