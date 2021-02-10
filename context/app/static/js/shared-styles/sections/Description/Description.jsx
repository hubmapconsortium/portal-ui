import React from 'react';
import Typography from '@material-ui/core/Typography';

import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { StyledPaper, StyledInfoIcon } from './style';

function Description({ padding, children }) {
  return (
    <StyledPaper $padding={padding}>
      <StyledInfoIcon color="primary" />
      <Typography variant="body1">{children}</Typography>
    </StyledPaper>
  );
}

function DescriptionSection({ children, padding }) {
  return (
    <SectionContainer>
      <Description padding={padding}>{children}</Description>
    </SectionContainer>
  );
}

export { Description };
export default DescriptionSection;
