import React from 'react';
import Typography from '@mui/material/Typography';

function PageTitle({ children, ...rest }) {
  return (
    <Typography component="h1" variant="h2" {...rest}>
      {children}
    </Typography>
  );
}

export default PageTitle;
