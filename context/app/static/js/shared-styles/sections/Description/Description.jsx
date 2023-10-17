import React from 'react';
import Typography from '@mui/material/Typography';

import { StyledPaper, StyledInfoIcon } from './style';

function Description({ padding, children, ...props }) {
  return (
    <StyledPaper $padding={padding} {...props}>
      <StyledInfoIcon color="primary" />
      <Typography variant="body1" as="div">
        {children}
      </Typography>
    </StyledPaper>
  );
}

export default Description;
