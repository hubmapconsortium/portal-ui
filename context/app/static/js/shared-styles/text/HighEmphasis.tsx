import React, { PropsWithChildren } from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';

function HighEmphasis({ children, ...rest }: PropsWithChildren & TypographyProps) {
  return (
    <Typography variant="subtitle2" color="textPrimary" component="span" {...rest}>
      {children}
    </Typography>
  );
}

export default HighEmphasis;
