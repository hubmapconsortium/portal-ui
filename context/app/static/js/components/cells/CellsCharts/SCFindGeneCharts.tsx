import { Dataset } from 'js/components/types';
import React, { useMemo } from 'react';
import useCellTypeExpressionBins from 'js/api/scfind/useCellTypeExpression';
import ChartLoader from 'js/shared-styles/charts/ChartLoader';
import Box from '@mui/material/Box';
import BarChart from 'js/shared-styles/charts/BarChart';
import useCellTypeCountForDataset from 'js/api/scfind/useCellTypeCountForDataset';
import Typography from '@mui/material/Typography';
import { useCurrentGeneContext } from '../SCFindResults/CurrentGeneContext';
import { SCFindCellTypesChart } from './CellTypesChart';

function SCFindGeneExpressionLevelDistributionPlot({ hubmap_id }: Dataset) {
  const gene = useCurrentGeneContext();

  const { data, isLoading: isLoadingCellExpression } = useCellTypeExpressionBins({
    geneList: gene,
    datasetName: hubmap_id,
  });

  const { data: { cellTypeCounts } = { cellTypeCounts: [] }, isLoading: loadingCellCount } = useCellTypeCountForDataset(
    { dataset: hubmap_id },
  );

  const isLoading = isLoadingCellExpression || loadingCellCount;

  const totalCells = useMemo(() => {
    if (!cellTypeCounts) {
      return 0;
    }
    return cellTypeCounts.reduce((acc, cellType) => {
      return acc + cellType.count;
    }, 0);
  }, [cellTypeCounts]);
  const geneData: Record<string, { value: number }> = useMemo(() => {
    if (!data || !gene || !data[gene]) {
      return {};
    }
    const entries = Object.entries(data[gene]);
    const nonZeroValues = Object.fromEntries(
      entries.map(([key, value]) => {
        return [key, { value }];
      }),
    );
    const sum = entries.reduce((acc, [_, value]) => acc + value, 0);
    return {
      '0': { value: totalCells - sum },
      ...nonZeroValues,
    };
  }, [data, gene, totalCells]);

  return (
    <Box p={2} width="100%">
      <Box height="600px">
        <ChartLoader isLoading={isLoading}>
          <Typography variant="subtitle2">Gene Expression Level Distribution Plot</Typography>
          <BarChart
            data={geneData}
            yAxisLabel="Frequency"
            xAxisLabel="Expression Level"
            margin={
              {
                top: 20,
                right: 20,
                bottom: 20,
                left: 80,
              } as const
            }
          />
        </ChartLoader>
      </Box>
    </Box>
  );
}

export default function SCFindGeneCharts(dataset: Dataset) {
  return (
    <div>
      <SCFindGeneExpressionLevelDistributionPlot {...dataset} />
      <SCFindCellTypesChart {...dataset} />
    </div>
  );
}
