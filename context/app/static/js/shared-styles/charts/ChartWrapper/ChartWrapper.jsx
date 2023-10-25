import React from 'react';
import { LegendOrdinal } from '@visx/legend';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { TitleWrapper } from 'js/shared-styles/charts/style';

function ChartWrapper({ children, chartTitle, margin, colorScale, dropdown }) {
  return (
    <Stack
      direction="row"
      sx={{
        height: '100%',
        width: '100%',
      }}
    >
      <Box sx={{ flexGrow: 1, minHeight: 0, minWidth: 0 }}>
        {chartTitle && (
          <TitleWrapper $leftOffset={margin.left - margin.right}>
            {chartTitle && <Typography>{chartTitle}</Typography>}
          </TitleWrapper>
        )}
        {children}
      </Box>
      <Stack sx={{ height: `calc(100% - ${margin.bottom}px)` }}>
        {dropdown && (
          <Box sx={{ marginTop: `${margin.top}px`, marginBottom: 1, maxWidth: 175, minWidth: 0 }}>{dropdown}</Box>
        )}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <LegendOrdinal
            scale={colorScale}
            labelMargin="0 15px 0 0"
            shapeStyle={() => ({
              borderRadius: '3px',
            })}
          />
        </Box>
      </Stack>
    </Stack>
  );
}

export default ChartWrapper;
