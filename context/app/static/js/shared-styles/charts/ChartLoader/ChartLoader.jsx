import React from 'react';
import Typography from '@mui/material/Typography';

import { StyledSkeleton } from './style';

function ChartLoader({ isLoading, children }) {
  if (isLoading) {
    return (
      <StyledSkeleton variant="rect">
        <div>
          <Typography>Please wait while your data is being retrieved.</Typography>
        </div>
      </StyledSkeleton>
    );
  }

  return children;
}

export default ChartLoader;
