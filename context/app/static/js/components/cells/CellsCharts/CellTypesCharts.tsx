import React from 'react';

import BarChart from 'js/shared-styles/charts/BarChart';
import ChartLoader from 'js/shared-styles/charts/ChartLoader';
import Box from '@mui/material/Box';
import { TooltipData } from 'js/shared-styles/charts/types';
import { DatasetCellsChartsProps } from './types';
import { useCellTypesChartsData } from './hooks';
import { useStore } from '../store';
import { extractLabel } from '../CellTypeResults/utils';
import { PaddedDiv } from './style';

function CellTypesChartTooltip({ tooltipData }: { tooltipData: TooltipData<{ value: number }> }) {
  if (!tooltipData.bar) {
    return tooltipData.key;
  }
  const cellType = tooltipData.key;
  const count = tooltipData.bar.data.value;
  return (
    <>
      {cellType} ({count} cells)
    </>
  );
}

function CellTypesChart({ uuid }: DatasetCellsChartsProps) {
  const { cellVariableNames } = useStore((state) => ({
    cellVariableNames: state.cellVariableNames,
  }));
  const { expressionData, isLoading } = useCellTypesChartsData({
    uuid,
    cellVariableNames,
  });

  // const totalCells = expressionData?.results.length ?? 0;
  const cellNames = cellVariableNames.map((cellTypeName) => extractLabel(cellTypeName)).filter(Boolean);
  const cellTypeCounts =
    expressionData?.results.reduce(
      (acc, result) => {
        const clid = result.cell_type;
        if (!clid) {
          return acc;
        }
        if (acc[clid]) {
          acc[clid] = {
            value: acc[clid].value + 1,
          };
        } else {
          acc[clid] = {
            value: 1,
          };
        }
        return acc;
      },
      {} as Record<string, { value: number }>,
    ) ?? {};

  return (
    <PaddedDiv>
      <Box height="600px">
        <ChartLoader isLoading={isLoading}>
          <BarChart
            data={cellTypeCounts}
            highlightedKeys={cellNames}
            yAxisLabel="Count"
            xAxisLabel="Cell Type"
            margin={
              {
                top: 20,
                right: 20,
                bottom: 20,
                left: 80,
              } as const
            }
            TooltipContent={CellTypesChartTooltip}
          />
        </ChartLoader>
        {/* {cellTypeCounts &&
        Object.entries(cellTypeCounts).map(([clid, count]) => (
          <div key={clid}>
            <h3>
              {count.value || 0} {clid} ({((count.value / totalCells) * 100).toFixed(2)}%)
            </h3>
          </div>
        ))} */}
      </Box>
    </PaddedDiv>
  );
}

export default CellTypesChart;
