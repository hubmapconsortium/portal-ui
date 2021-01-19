import React from 'react';
import Typography from '@material-ui/core/Typography';

import SectionContainer from 'js/shared-styles/sections/SectionContainer';
import { StyledPaper, StyledInfoIcon } from './style';

function Description(props) {
  const { children, padding } = props;
  return (
    <SectionContainer>
      <StyledPaper $padding={padding}>
        <StyledInfoIcon color="primary" />
        <Typography variant="body1">{children}</Typography>
      </StyledPaper>
    </SectionContainer>
  );
}

export default Description;
