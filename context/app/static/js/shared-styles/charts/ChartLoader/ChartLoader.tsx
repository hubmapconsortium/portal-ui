import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';

import { StyledSkeleton } from './style';

interface ChartLoaderProps extends PropsWithChildren {
  isLoading: boolean;
}

function ChartLoader({ isLoading, children }: ChartLoaderProps) {
  if (isLoading) {
    return (
      <StyledSkeleton variant="rectangular">
        <div>
          <Typography>Please wait while your data is being retrieved.</Typography>
        </div>
      </StyledSkeleton>
    );
  }

  return children;
}

export default ChartLoader;
