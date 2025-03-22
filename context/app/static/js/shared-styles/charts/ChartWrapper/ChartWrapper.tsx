import React, { PropsWithChildren } from 'react';
import { LegendOrdinal } from '@visx/legend';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { TitleWrapper } from 'js/shared-styles/charts/style';
import { OrdinalScale } from '../hooks';

interface ChartWrapperProps extends PropsWithChildren {
  chartTitle?: string;
  margin: Record<'top' | 'right' | 'bottom' | 'left', number>;
  colorScale: OrdinalScale;
  xAxisDropdown?: React.ReactNode;
  yAxisDropdown?: React.ReactNode;
  additionalControls?: React.ReactNode;
  dropdown?: React.ReactNode;
  allKeysScale?: OrdinalScale;
}

function ChartWrapper({
  children,
  chartTitle,
  margin,
  colorScale,
  dropdown,
  xAxisDropdown,
  yAxisDropdown,
  additionalControls,
  allKeysScale,
}: ChartWrapperProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateAreas: `
          "title        title        title        buttons"
          "top-controls top-controls top-controls top-controls"
          "y-axis       y-axis       y-axis       legend"
          "chart        chart        chart        legend"
          "x-axis       x-axis       x-axis       legend"
        `,
        overflow: 'none',
        gridTemplateColumns: 'auto auto auto fit-content(175px)',
        gridTemplateRows: 'auto auto minmax(0, auto) 500px minmax(0, auto)',
      }}
    >
      {chartTitle && (
        <TitleWrapper $leftOffset={margin.left - margin.right} sx={{ gridArea: 'title' }}>
          {chartTitle && <Typography>{chartTitle}</Typography>}
        </TitleWrapper>
      )}
      <Box sx={{ gridArea: 'y-axis', p: yAxisDropdown ? 1 : 0 }}>{yAxisDropdown}</Box>
      <Box sx={{ gridArea: 'chart' }}>{children}</Box>
      <Box sx={{ gridArea: 'x-axis', p: xAxisDropdown ? 1 : 0 }}>{xAxisDropdown}</Box>
      <Box sx={{ gridArea: 'legend', display: 'flex', flexDirection: 'column', maxHeight: '100%', overflow: 'none' }}>
        {dropdown && <Box sx={{ marginY: 1, minWidth: 0 }}>{dropdown}</Box>}
        <Box sx={{ flex: 1, overflowY: 'auto' }} tabIndex={0}>
          <LegendOrdinal
            scale={colorScale}
            labelMargin="0 15px 0 0"
            shapeStyle={() => ({
              borderRadius: '4px',
            })}
          />
          {allKeysScale && (
            /* This is used to prevent content shifts when toggling between different sets of data */
            <Box sx={{ height: 0, speak: 'none', overflow: 'hidden' }}>
              <LegendOrdinal
                scale={allKeysScale}
                labelMargin="0 15px 0 0"
                shapeStyle={() => ({ borderRadius: '3px' })}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ gridArea: 'top-controls' }}>{additionalControls}</Box>
    </Box>
  );
}

export default ChartWrapper;
