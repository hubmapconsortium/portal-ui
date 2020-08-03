import React from 'react';
import Typography from '@material-ui/core/Typography';

import SectionContainer from '../SectionContainer';
import { StyledPaper, StyledInfoIcon } from './style';

function Description(props) {
  const { children } = props;
  return (
    <SectionContainer>
      <StyledPaper>
        <StyledInfoIcon color="primary" />
        <Typography variant="body1">{children}</Typography>
      </StyledPaper>
    </SectionContainer>
  );
}

export default Description;
