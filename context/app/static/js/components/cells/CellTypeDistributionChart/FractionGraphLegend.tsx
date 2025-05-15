import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { decimal, percent } from 'js/helpers/number-format';
import { OrdinalScale } from 'js/shared-styles/charts/hooks';

interface FractionGraphLegendProps {
  targetColorScale: OrdinalScale;
  otherColorScale: OrdinalScale;
  mappedCellCounts: Record<string, number>;
  totalCellCount: number;
}

export default function FractionGraphLegend({
  targetColorScale,
  otherColorScale,
  mappedCellCounts,
  totalCellCount,
}: FractionGraphLegendProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mt={1}>
      <Stack>
        <Typography variant="body2" color="textSecondary" my={1}>
          Targeted Cell Types
        </Typography>
        <LegendOrdinal scale={targetColorScale} labelFormat={(label) => label.split('.').slice(1).join('.')}>
          {(labels) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {labels.map((label) => {
                if (!label.text) return null;
                return (
                  <LegendItem key={`legend-${label.text}`} margin="0 1rem 0 0">
                    <svg width="1em" height="1em" style={{ borderRadius: '0.25rem' }}>
                      <rect fill={targetColorScale(label.datum)} width="1em" height="1em" />
                    </svg>
                    <LegendLabel align="left" margin="0 0 0 4px">
                      {label.text} ({decimal.format(mappedCellCounts[label.datum])} cells,{' '}
                      {percent.format(mappedCellCounts[label.datum] / totalCellCount)} of total)
                    </LegendLabel>
                  </LegendItem>
                );
              })}
            </div>
          )}
        </LegendOrdinal>
      </Stack>
      <Stack>
        <Typography variant="body2" color="textSecondary" my={1}>
          Other Cell Types
        </Typography>
        <Box maxHeight={300} overflow="auto">
          <LegendOrdinal
            scale={otherColorScale}
            labelFormat={(label) => label.split('.').slice(1).join('.')}
            shapeStyle={() => ({ borderRadius: '4px' })}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
