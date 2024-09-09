import React from 'react';
import Typography from '@mui/material/Typography';

import { PaperProps } from '@mui/material/Paper';
import { StyledPaper, StyledInfoIcon } from './style';

interface DescriptionProps extends PaperProps {
  noIcon?: boolean;
}

function Description({ children, noIcon = false, ...props }: DescriptionProps) {
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
