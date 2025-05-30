import React from 'react';
import Typography from '@mui/material/Typography';

import { PaperProps } from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { InfoIcon } from 'js/shared-styles/icons';
import { StyledPaper } from './style';

interface DescriptionProps extends PaperProps {
  noIcon?: boolean;
  belowTheFold?: React.ReactNode;
}

function Description({ children, noIcon = false, belowTheFold, ...props }: DescriptionProps) {
  return (
    <StyledPaper {...props}>
      <Stack direction="row" alignItems="start" spacing={2}>
        {!noIcon && <InfoIcon fontSize="1.25rem" color="primary" />}
        <Typography variant="body1" component="div">
          {children}
        </Typography>
      </Stack>
      {belowTheFold}
    </StyledPaper>
  );
}

export default Description;
