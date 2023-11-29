import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';

import SectionHeader from 'js/shared-styles/sections/SectionHeader';
import Description from 'js/shared-styles/sections/Description';

import { DetailPageSection } from '../detailPage/style';
import { useCellTypeOrgans } from './hooks';
import VerticalStackedBarChart from 'js/shared-styles/charts/VerticalStackedBarChart';
import { useBandScale, useLogScale, useOrdinalScale } from 'js/shared-styles/charts/hooks';
import { AnyScaleBand } from '@visx/shape/lib/types';
import { tooltipHasBarData } from 'js/shared-styles/charts/types';

// Define the keys for the stack
type GraphKey = 'total_cells' | 'celltype_cells';
const keys = ['total_cells', 'celltype_cells'] as GraphKey[];
const keyLabels: Record<GraphKey, string> = {
  total_cells: 'Total Cells',
  celltype_cells: 'Cell Type Cells',
};

const margin = { top: 20, right: 20, bottom: 100, left: 60 };

export default function CellTypesVisualization() {
  const { data: organs = [] } = useCellTypeOrgans();
  const sortedOrgans = [...organs].sort((a, b) => b.total_cells - a.total_cells);

  const xScale = useBandScale(sortedOrgans.map((d) => d.organ));
  const yScale = useLogScale(sortedOrgans.map((d) => d.total_cells, {
    nice: true,
  }));
  const colorScale = useOrdinalScale(keys, {range: ['#89A05F', '#4B5F27']})

  function setXScaleRange(scale: typeof xScale, max: number) {
    scale.range([0, max]);
  }

  function setYScaleRange(scale: typeof yScale, max: number) {
    scale.range([max, 1]);
  }


  // Only show ticks for powers of 10
  // const rowTickValues = yScale.ticks(5).filter((d) => Number.isInteger(Math.log10(d)));

  // const axisLabelProps: TickLabelProps<string> = {
  //   fontSize: 14,
  //   color: 'black',
  //   fontWeight: 500,
  //   fontFamily: 'Inter Variable',
  // };

  return (
    <DetailPageSection>
      <SectionHeader>Visualization</SectionHeader>
      <Description>Cell counts in this visualization are dependent on the data available within HuBMAP.</Description>
      <VerticalStackedBarChart 
        visxData={sortedOrgans}
        yScale={yScale}
        xScale={xScale}
        setXScaleRange={setXScaleRange}
        setYScaleRange={setYScaleRange}
        colorScale={colorScale}
        keys={keys}
        margin={margin}
        xAxisLabel="Organ"
        yAxisLabel="Cell Count"
        xAxisTickLabels={sortedOrgans.map((d) => d.organ)}
        // TooltipContent={({ tooltipData }) => {
        //   if (!tooltipHasBarData(tooltipData)) {
        //     return null;
        //   }

        //   const { key, bar } = tooltipData;
        //   const { data } = bar;

        //   return (
        //     <Stack direction="column" spacing={0.5} p={2}>
        //       <Typography variant="body1" component="label">
        //         {keyLabels[key as GraphKey]}
        //       </Typography>
        //       <Typography variant="body1" component="label">
        //         {data[key]}
        //       </Typography>
        //     </Stack>
        //   );
        // }}
      />

      <Stack direction="column" spacing={0.5} p={2} position="absolute" right={0} top={2}>
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
