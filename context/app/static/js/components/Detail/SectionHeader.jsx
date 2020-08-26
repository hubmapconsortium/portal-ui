import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

/* Anchor offset for fixed header
70px = fixed header height + 10px */
const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
  padding-top: 70px;
  margin-top: -70px;
`;

function SectionHeader(props) {
  const { children, isSummary, ...rest } = props;

  const variant = isSummary ? 'h2' : 'h4';
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <StyledTypography variant={variant} component="h2" {...rest}>
      {children}
    </StyledTypography>
  );
}

export default SectionHeader;
