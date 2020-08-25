import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';

const StyledContainer = styled(Container)`
  margin-top: ${(props) => (props.$mt ? props.theme.spacing(2) : 0)}px;
`;

function Route({ children, mt, constrainWidth }) {
  const constrainWidthProps = constrainWidth ? { maxWidth: 'lg' } : { maxWidth: false, disableGutters: true };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <StyledContainer $mt={mt} {...constrainWidthProps}>
      {children}
    </StyledContainer>
  );
}

Route.propTypes = {
  mt: PropTypes.bool,
  constrainWidth: PropTypes.bool,
};

Route.defaultProps = {
  mt: false,
  constrainWidth: false,
};

export default Route;
