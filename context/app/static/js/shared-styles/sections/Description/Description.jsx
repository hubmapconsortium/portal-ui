import React from 'react';
import Typography from '@mui/material/Typography';

import { StyledPaper, StyledInfoIcon } from './style';

function Description({ children, noIcon, ...props }) {
  return (
    <StyledPaper {...props}>
      {!noIcon && <StyledInfoIcon color="primary" />}
      <Typography variant="body1" component="div">
        {children}
      </Typography>
    </StyledPaper>
  );
}

export default Description;
