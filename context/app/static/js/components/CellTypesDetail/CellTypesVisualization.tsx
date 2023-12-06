import React, { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Description from 'js/shared-styles/sections/Description';

import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart';
import { useBandScale, useLogScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
import { TooltipData } from 'js/shared-styles/charts/types';
import { CellTypeOrgan, useCellTypeName, useCellTypeOrgans } from './hooks';
import { DetailPageSection } from '../detailPage/style';

// Define the keys for the stack
type GraphKey = keyof Pick<CellTypeOrgan, 'other_cells' | 'celltype_cells'>;
const keys = ['celltype_cells', 'other_cells'] as GraphKey[];

const margin = { top: 20, right: 20, bottom: 100, left: 60 };

function getX(d: unknown): string {
  const data = d as CellTypeOrgan;
  return data.organ;
}

function getXScaleRange(max: number): [number, number] {
  return [0, max];
}

function getYScaleRange(max: number): [number, number] {
  return [max, 1];
}

function CellTypesVisualizationTooltip({ tooltipData }: { tooltipData: TooltipData<CellTypeOrgan> }) {
  const data = tooltipData.bar?.data;
  const currentKey = tooltipData.key as GraphKey;
  const totalCells = data?.total_cells ?? 0;
  const currentKeyCount = data?.[currentKey] ?? 0;
  const currentKeyPercentage = ((currentKeyCount / totalCells) * 100).toFixed(2);

  const cellTypeName = useCellTypeName();
  const tooltipLabel = currentKey === 'celltype_cells' ? cellTypeName : 'Other Cells';
  return (
    <Stack spacing={1} p={1}>
      <Typography variant="subtitle1" component="div" color="gray">
        {data?.organ ?? currentKey}
      </Typography>
      {data && (
        <>
          <Typography variant="body1" component="div" color="gray">
            {tooltipLabel} (Total Cell Count: {totalCells.toLocaleString()})
          </Typography>
          <Typography variant="h2" component="div" color="black">
            {`${currentKeyCount.toLocaleString()} (${currentKeyPercentage}%)`}
          </Typography>
        </>
      )}
    </Stack>
  );
}

export default function CellTypesVisualization() {
  const { data: organs = [] } = useCellTypeOrgans();
  const name = useCellTypeName();
  const sortedOrgans = [...organs].sort((a, b) => b.celltype_cells - a.celltype_cells);

  const xScale = useBandScale(sortedOrgans.map((d) => d.organ));
  const yScale = useLogScale(
    sortedOrgans.map((d) => d.total_cells),
    {
      nice: true,
    },
  );
  const colorScale = useOrdinalScale(keys, { range: ['#4B5F27', '#D1DAC1'] });

  const organLabels = sortedOrgans.map((d) => d.organ);

  const keyLabels: Record<GraphKey, string> = useMemo(() => {
    return {
      celltype_cells: name ?? 'Cell Type',
      other_cells: 'Other Cells',
    };
  }, [name]);

  return (
    <DetailPageSection id="distribution-across-organs">
      <SectionHeader>Distribution Across Organs</SectionHeader>
      <Description>Cell counts in this visualization are dependent on the data available within HuBMAP.</Description>
      <Stack direction="row" height={500}>
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
          xAxisLabel="Organs"
          yAxisLabel="Cell Count"
          xAxisTickLabels={organLabels}
          y0={(d) => Math.max(d[0], 1)} // Ensure that y0 is always > 0
          getTickValues={(y) => y.ticks(5).filter((d) => Number.isInteger(Math.log10(d)))}
          TooltipContent={CellTypesVisualizationTooltip}
        />
        <Stack direction="column" spacing={0.5} p={2}>
          <Typography variant="body1" component="label">
            Cell Types
          </Typography>
          <LegendOrdinal scale={colorScale} labelFormat={(label) => keyLabels[label as GraphKey]}>
            {(labels) => (
              <Stack spacing={0.5} useFlexGap direction="column">
                {labels.map((label) => (
                  <Box component={LegendItem} alignItems="start" key={`legend-quantile-${label.text}`}>
                    <svg width={15} height={15} style={{ borderRadius: 4 }}>
                      <rect fill={label.value} width={15} height={15} />
                    </svg>
                    <LegendLabel align="left" margin="0 0 0 4px">
                      {label.text}
                    </LegendLabel>
                  </Box>
                ))}
              </Stack>
            )}
          </LegendOrdinal>
        </Stack>
      </Stack>
    </DetailPageSection>
  );
}
