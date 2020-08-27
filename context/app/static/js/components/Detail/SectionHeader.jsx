import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const StyledTypography = styled(Typography)`
  margin-bottom: ${(props) => props.theme.spacing(1)}px;
`;

function SectionHeader(props) {
  const { children, ...rest } = props;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <StyledTypography variant="h4" component="h2" {...rest}>
      {children}
    </StyledTypography>
  );
}

export default SectionHeader;
