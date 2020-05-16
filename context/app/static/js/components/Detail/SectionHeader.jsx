import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

const StyledTypography = styled(Typography)`
  margin-bottom: 6px;
`;

function SectionHeader(props) {
  const { children, ...rest } = props;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <StyledTypography {...rest}>{children}</StyledTypography>
  );
}

export default SectionHeader;
