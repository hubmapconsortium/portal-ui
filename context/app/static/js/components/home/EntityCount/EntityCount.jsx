import React from 'react';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import { FlexLink, StyledDiv } from './style';

function EntityCount({ icon, count, label, href }) {
  return (
    <FlexLink href={href}>
      <StyledDiv>{icon}</StyledDiv>
      <div>
        <Typography variant="h2" component="p">
          {count || <Skeleton />}
        </Typography>
        <Typography variant="h6" component="p">
          {label}
        </Typography>
      </div>
    </FlexLink>
  );
}

export default EntityCount;
