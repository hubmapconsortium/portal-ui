import React from 'react';
import Typography from '@mui/material/Typography';

import { StyledPaper, StyledInfoIcon } from './style';

function Description({ children, ...props }) {
  return (
    <StyledPaper {...props}>
      <StyledInfoIcon color="primary" />
      <Typography variant="body1" component="div">
        {children}
      </Typography>
    </StyledPaper>
  );
}

export default Description;
