import React from 'react';
import Typography from '@material-ui/core/Typography';

import { StyledSkeleton } from './style';

function ChartLoader() {
  return (
    <StyledSkeleton variant="rect">
      <div>
        <Typography>Please wait while your data is being retrieved.</Typography>
      </div>
    </StyledSkeleton>
  );
}

export default ChartLoader;
