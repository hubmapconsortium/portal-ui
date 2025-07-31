import React, { useEffect, useMemo } from 'react';

import BarChart from 'js/shared-styles/charts/BarChart';
import ChartLoader from 'js/shared-styles/charts/ChartLoader';
import Box from '@mui/material/Box';
import { TooltipData } from 'js/shared-styles/charts/types';
import { createContext, useContext } from 'js/helpers/context';
import useCellTypeCountForDataset from 'js/api/scfind/useCellTypeCountForDataset';
import { Dataset } from 'js/components/types';
import Typography from '@mui/material/Typography';
import { decimal, percent } from 'js/helpers/number-format';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import { useCellTypesChartsData } from './hooks';
import { extractLabel } from '../CrossModalityResults/utils';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { useMolecularDataQueryFormTracking } from '../MolecularDataQueryForm/MolecularDataQueryFormTrackingProvider';

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
      {cellType} ({decimal.format(count)} cells, {percent.format(count / totalCells)})
    </>
  );
}

type CellTypeCounts = Record<string, { value: number }>;

interface CellTypesChartProps {
  totalCells: number;
  cellTypeCounts: CellTypeCounts;
  isLoading: boolean;
  cellNames: string[];
  title?: React.ReactNode;
}

const margin = {
  top: 20,
  right: 20,
  bottom: 220,
  left: 80,
} as const;

function CellTypesChart({ totalCells, cellTypeCounts, isLoading, cellNames, title }: CellTypesChartProps) {
  return (
    <Box p={2} width="100%">
      <Box height="600px">
        <TotalCellsContext.Provider value={totalCells}>
          <ChartLoader isLoading={isLoading}>
            {title && (
              <Typography variant="subtitle2" display="flex" alignItems="center">
                {title}
              </Typography>
            )}
            <BarChart
              data={cellTypeCounts}
              highlightedKeys={cellNames}
              yAxisLabel="Count"
              xAxisLabel="Cell Type"
              margin={margin}
              TooltipContent={CellTypesChartTooltip}
            />
          </ChartLoader>
        </TotalCellsContext.Provider>
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
    const counts = expressionData.results.reduce((acc: CellTypeCounts, result) => {
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
    }, {});

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
  const { track } = useMolecularDataQueryFormTracking();

  useEffect(() => {
    // Easier to use the mount event of this chart to track expand/collapse of the row
    // Than to track the row itself
    track('Results / Expand Row', hubmap_id);

    return () => {
      track('Results / Collapse Row', hubmap_id);
    };
  }, [hubmap_id, track]);

  const cellVariableNames = useCellVariableNames();
  const { data, isLoading } = useCellTypeCountForDataset({ dataset: hubmap_id });
  const cellNames = useMemo(() => {
    return cellVariableNames.map((cellTypeName) => cellTypeName.split('.')[1]).filter(Boolean);
  }, [cellVariableNames]);

  const [cellTypeCounts, totalCells] = useMemo(() => {
    if (!data) {
      return [{}, 0];
    }
    const counts = data.cellTypeCounts.reduce((acc: CellTypeCounts, result) => {
      const label = result.index.split('.')[1];
      if (!label) {
        return acc;
      }
      acc[label] = {
        value: result.count,
      };
      return acc;
    }, {});
    const total = data.cellTypeCounts.reduce((acc, result) => acc + result.count, 0);
    return [counts, total] as const;
  }, [data]);

  return (
    <CellTypesChart
      title={
        <>
          Cell Type Distribution Plot{' '}
          <InfoTextTooltip tooltipTitle="Plot showing the distribution of cell types in the dataset, with any cell types of interest emphasized." />
        </>
      }
      totalCells={totalCells}
      cellTypeCounts={cellTypeCounts}
      isLoading={isLoading}
      cellNames={cellNames}
    />
  );
}

export default CellTypesChart;
