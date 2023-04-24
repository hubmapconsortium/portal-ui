import React from 'react';
import Typography from '@material-ui/core/Typography';

function PageTitle({ children, ...rest }) {
  return (
    <Typography component="h1" variant="h2" {...rest}>
      {children}
    </Typography>
  );
}

export default PageTitle;
