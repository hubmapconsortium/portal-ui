import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid2';
import { vitessceFixedHeight } from '../style';

function VisualizationSkeleton() {
  return (
    <Grid container height={vitessceFixedHeight} spacing={1} mt={1} width="100%">
      {/* Top half - 4 squares */}
      <Grid
        size={{
          xs: 12,
        }}
        container
        spacing={1}
        height="50%"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Grid
            key={`square-${i}`}
            size={{
              xs: 6,
              sm: 3,
            }}
          >
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Grid>
        ))}
      </Grid>
      {/* Bottom half - 2 rectangles */}
      <Grid
        size={{
          xs: 12,
        }}
        container
        spacing={1}
        height="50%"
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <Grid
            key={`rect-${i}`}
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default VisualizationSkeleton;
