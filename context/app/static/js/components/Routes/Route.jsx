import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';

const StyledContainer = styled(Container)`
  margin-top: ${(props) => props.theme.spacing(2)}px;
`;

function Route({ children, disableWidthConstraint }) {
  const constrainWidthProps = disableWidthConstraint ? { maxWidth: false, disableGutters: true } : { maxWidth: 'lg' };

  return <StyledContainer {...constrainWidthProps}>{children}</StyledContainer>;
}

Route.propTypes = {
  disableWidthConstraint: PropTypes.bool,
};

Route.defaultProps = {
  disableWidthConstraint: false,
};

export default Route;
