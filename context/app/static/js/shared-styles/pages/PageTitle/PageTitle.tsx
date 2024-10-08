import React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';

function PageTitle({ children, ...rest }: TypographyProps) {
  return (
    <Typography component="h1" variant="h2" {...rest}>
      {children}
    </Typography>
  );
}

export default PageTitle;
