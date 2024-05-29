import React, { PropsWithChildren } from 'react';
import { LegendOrdinal } from '@visx/legend';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { TitleWrapper } from 'js/shared-styles/charts/style';
import { OrdinalScale } from '../hooks';

interface ChartWrapperProps extends PropsWithChildren {
  chartTitle?: string;
  margin: Record<'top' | 'right' | 'bottom' | 'left', number>;
  colorScale: OrdinalScale;
  dropdown?: React.ReactNode;
  allKeysScale?: OrdinalScale;
}

function ChartWrapper({ children, chartTitle, margin, colorScale, dropdown, allKeysScale }: ChartWrapperProps) {
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
      <Stack sx={{ paddingTop: `${margin.top}px`, height: `calc(100% - ${margin.bottom}px)`, maxWidth: 175 }}>
        {dropdown && <Box sx={{ marginBottom: 1, minWidth: 0 }}>{dropdown}</Box>}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          <LegendOrdinal
            scale={colorScale}
            labelMargin="0 15px 0 0"
            shapeStyle={() => ({
              borderRadius: '3px',
            })}
          />
        </Box>
        {allKeysScale && (
          /* This is used to prevent content shifts when toggling between different sets of data */
          <Box sx={{ height: 0, speak: 'none', overflow: 'hidden' }}>
            <LegendOrdinal scale={allKeysScale} labelMargin="0 15px 0 0" shapeStyle={() => ({ borderRadius: '3px' })} />
          </Box>
        )}
      </Stack>
    </Stack>
  );
}

export default ChartWrapper;
