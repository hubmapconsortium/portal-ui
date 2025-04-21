import React, { useMemo } from 'react';

import BarChart from 'js/shared-styles/charts/BarChart';
import ChartLoader from 'js/shared-styles/charts/ChartLoader';
import Box from '@mui/material/Box';
import { TooltipData } from 'js/shared-styles/charts/types';
import { createContext, useContext } from 'js/helpers/context';
import useCellTypeCountForDataset from 'js/api/scfind/useCellTypeCountForDataset';
import { Dataset } from 'js/components/types';
import { useCellTypesChartsData } from './hooks';
import { extractLabel } from '../CrossModalityResults/utils';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';

const TotalCellsContext = createContext<number>('Total Cells');
const useTotalCells = () => useContext(TotalCellsContext);

function CellTypesChartTooltip({ tooltipData }: { tooltipData: TooltipData<{ value: number }> }) {
  const totalCells = useTotalCells();

  if (!tooltipData.bar) {
    return tooltipData.key;
  }
  const cellType = tooltipData.key;
  const count = tooltipData.bar.data.value;
  return (
    <>
      {cellType} ({count} cells, {((count / totalCells) * 100).toFixed(2)}%)
    </>
  );
}

interface CellTypesChartProps {
  totalCells: number;
  cellTypeCounts: Record<string, { value: number }>;
  isLoading: boolean;
  cellNames: string[];
}

function CellTypesChart({ totalCells, cellTypeCounts, isLoading, cellNames }: CellTypesChartProps) {
  return (
    <Box p={2} width="100%">
      <Box height="600px">
        <TotalCellsContext.Provider value={totalCells}>
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
        </TotalCellsContext.Provider>
        {/* {cellTypeCounts &&
        Object.entries(cellTypeCounts).map(([clid, count]) => (
          <div key={clid}>
            <h3>
              {count.value || 0} {clid} ({((count.value / totalCells) * 100).toFixed(2)}%)
            </h3>
          </div>
        ))} */}
      </Box>
    </Box>
  );
}

export function CrossModalityCellTypesChart({ uuid }: Dataset) {
  const cellVariableNames = useCellVariableNames();
  const { expressionData, isLoading } = useCellTypesChartsData({
    uuid,
    cellVariableNames,
  });

  const cellNames = useMemo(() => {
    return cellVariableNames.map((cellTypeName) => extractLabel(cellTypeName)).filter(Boolean);
  }, [cellVariableNames]);

  const [cellTypeCounts, totalCells] = useMemo(() => {
    if (!expressionData) {
      return [{}, 0] as const;
    }
    const counts = expressionData.results.reduce(
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
    );

    const total = Object.values(counts).reduce((acc, count) => acc + count.value, 0);
    return [counts, total] as const;
  }, [expressionData]);

  return (
    <CellTypesChart
      totalCells={totalCells}
      cellTypeCounts={cellTypeCounts}
      isLoading={isLoading}
      cellNames={cellNames}
    />
  );
}

export function SCFindCellTypesChart({ hubmap_id }: Dataset) {
  const cellVariableNames = useCellVariableNames();
  const { data, isLoading } = useCellTypeCountForDataset({ dataset: hubmap_id });
  const cellNames = useMemo(() => {
    return cellVariableNames.map((cellTypeName) => cellTypeName.split('.')[1]).filter(Boolean);
  }, [cellVariableNames]);

  const [cellTypeCounts, totalCells] = useMemo(() => {
    if (!data) {
      return [{}, 0];
    }
    const counts = data.cellTypeCounts.reduce(
      (acc, result) => {
        const label = result.index.split('.')[1];
        if (!label) {
          return acc;
        }
        acc[label] = {
          value: result.count,
        };
        return acc;
      },
      {} as Record<string, { value: number }>,
    );
    const total = data.cellTypeCounts.reduce((acc, result) => acc + result.count, 0);
    return [counts, total] as const;
  }, [data]);

  return (
    <CellTypesChart
      totalCells={totalCells}
      cellTypeCounts={cellTypeCounts}
      isLoading={isLoading}
      cellNames={cellNames}
    />
  );
}

export default CellTypesChart;
