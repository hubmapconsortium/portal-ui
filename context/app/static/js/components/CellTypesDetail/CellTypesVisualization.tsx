import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Description from 'js/shared-styles/sections/Description';

import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart';
import { useBandScale, useLogScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
import { CellTypeOrgan, useCellTypeOrgans } from './hooks';
import { DetailPageSection } from '../detailPage/style';

// Define the keys for the stack
type GraphKey = keyof Pick<CellTypeOrgan, 'other_cells' | 'celltype_cells'>;
const keys = ['other_cells', 'celltype_cells'] as GraphKey[];
const keyLabels: Record<GraphKey, string> = {
  other_cells: 'Other Cells',
  celltype_cells: 'Cell Type Cells',
};

const margin = { top: 20, right: 20, bottom: 100, left: 60 };

function getX(d: unknown): string {
  return (d as CellTypeOrgan).organ;
}

function getXScaleRange(max: number): [number, number] {
  return [0, max];
}

function getYScaleRange(max: number): [number, number] {
  return [max, 1];
}

export default function CellTypesVisualization() {
  const { data: organs = [] } = useCellTypeOrgans();
  const sortedOrgans = [...organs].sort((a, b) => b.total_cells - a.total_cells);

  const xScale = useBandScale(sortedOrgans.map((d) => d.organ));
  const yScale = useLogScale(
    sortedOrgans.map((d) => d.total_cells, {
      nice: true,
    }),
  );
  const colorScale = useOrdinalScale(keys, { range: ['#89A05F', '#4B5F27'] });

  // Only show ticks for powers of 10
  // const rowTickValues = yScale.ticks(5).filter((d) => Number.isInteger(Math.log10(d)));

  // const axisLabelProps: TickLabelProps<string> = {
  //   fontSize: 14,
  //   color: 'black',
  //   fontWeight: 500,
  //   fontFamily: 'Inter Variable',
  // };

  const organLabels = sortedOrgans.map((d) => d.organ);

  return (
    <DetailPageSection>
      <SectionHeader>Visualization</SectionHeader>
      <Description>Cell counts in this visualization are dependent on the data available within HuBMAP.</Description>
      <div style={{ height: 500 }}>
        <VerticalStackedBarChart
          initialHeight={500}
          visxData={sortedOrgans}
          yScale={yScale}
          xScale={xScale}
          getXScaleRange={getXScaleRange}
          getYScaleRange={getYScaleRange}
          colorScale={colorScale}
          keys={keys}
          margin={margin}
          getX={getX}
          xAxisLabel="Organ"
          yAxisLabel="Cell Count"
          xAxisTickLabels={organLabels}
        />
      </div>

      <Stack direction="column" spacing={0.5} p={2}>
        <Typography variant="body1" component="label">
          Cell Types
        </Typography>
        <LegendOrdinal scale={colorScale} labelFormat={(label) => keyLabels[label as GraphKey]}>
          {(labels) => (
            <>
              {labels.map((label) => (
                <LegendItem key={`legend-quantile-${label.text}`}>
                  <svg width={15} height={15} style={{ borderRadius: 4 }}>
                    <rect fill={label.value} width={15} height={15} />
                  </svg>
                  <LegendLabel align="left" margin="0 0 0 4px">
                    {label.text}
                  </LegendLabel>
                </LegendItem>
              ))}
            </>
          )}
        </LegendOrdinal>
      </Stack>
    </DetailPageSection>
  );
}
