import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

function SectionHeader({ children, ...rest }) {
  return (
    <StyledTypography variant="h4" component="h2" {...rest}>
      {children}
    </StyledTypography>
  );
}

export default SectionHeader;
