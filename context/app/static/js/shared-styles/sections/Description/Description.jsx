import React from 'react';
import Typography from '@material-ui/core/Typography';

import { StyledPaper, StyledInfoIcon } from './style';

function Description({ padding, children, withIcon = true, ...props }) {
  return (
    <StyledPaper $padding={padding} {...props}>
      {withIcon && <StyledInfoIcon color="primary" />}
      <Typography variant="body1">{children}</Typography>
    </StyledPaper>
  );
}

export default Description;
