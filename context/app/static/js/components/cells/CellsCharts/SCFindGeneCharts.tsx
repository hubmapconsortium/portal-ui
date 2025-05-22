import { Dataset } from 'js/components/types';
import React, { useMemo } from 'react';
import useCellTypeExpressionBins from 'js/api/scfind/useCellTypeExpression';
import ChartLoader from 'js/shared-styles/charts/ChartLoader';
import Box from '@mui/material/Box';
import BarChart from 'js/shared-styles/charts/BarChart';
import Typography from '@mui/material/Typography';
import { TooltipData } from 'js/shared-styles/charts/types';
import { decimal, percent } from 'js/helpers/number-format';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import { useCurrentGeneContext, useOptionalGeneContext } from '../SCFindResults/CurrentGeneContext';
import { SCFindCellTypesChart } from './CellTypesChart';
import { useTotalCells } from './hooks';

const GeneExpressionTooltipWithDataset = (dataset: string) => {
  return function GeneExpressionTooltip({
    tooltipData: { bar, key },
  }: {
    tooltipData: TooltipData<{ value: number }>;
  }) {
    const totalCells = useTotalCells(dataset);
    const gene = useCurrentGeneContext();
    if (bar) {
      if (key === '0') {
        return (
          <>
            {decimal.format(bar.data.value)} cells ({percent.format(bar.data.value / totalCells)}) do not express {gene}
          </>
        );
      }
      const count = bar.data.value;
      return (
        <>
          {key} ({decimal.format(count)} cells, {percent.format(count / totalCells)})
        </>
      );
    }
    return key;
  };
};

const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 80,
} as const;

function SCFindGeneExpressionLevelDistributionPlot({ hubmap_id }: Dataset) {
  const gene = useOptionalGeneContext();

  const { data, isLoading } = useCellTypeExpressionBins({
    geneList: gene,
    datasetName: hubmap_id,
  });

  const totalCells = useTotalCells(hubmap_id);

  const geneData: Record<string, { value: number }> = useMemo(() => {
    if (!data || !gene || !data[gene]) {
      return {};
    }
    const entries = Object.entries(data[gene]);
    const nonZeroValues = Object.fromEntries(
      entries.map(([key, value]) => {
        return [key, { value, key }];
      }),
    );
    const sum = entries.reduce((acc, [_, value]) => acc + value, 0);
    return {
      '0': { value: totalCells - sum },
      ...nonZeroValues,
    };
  }, [data, gene, totalCells]);

  const GeneExpressionTooltip = useMemo(() => {
    return GeneExpressionTooltipWithDataset(hubmap_id);
  }, [hubmap_id]);

  // If a gene is not defined, this chart should not be displayed
  // This happens in pathway tabs.
  if (!gene) {
    return null;
  }

  return (
    <Box p={2} width="100%">
      <Box height="600px">
        <ChartLoader isLoading={isLoading}>
          <Typography variant="subtitle2" display="flex" alignItems="center">
            Gene Expression Level Distribution Plot{' '}
            <InfoTextTooltip tooltipTitle="This plot shows the distribution of gene expression levels within this dataset." />
          </Typography>
          <BarChart
            data={geneData}
            yAxisLabel="Frequency"
            xAxisLabel="Expression Level"
            margin={margin}
            TooltipContent={GeneExpressionTooltip}
          />
        </ChartLoader>
      </Box>
    </Box>
  );
}

export default function SCFindGeneCharts(dataset: Dataset) {
  return (
    <Box py={2}>
      <SCFindGeneExpressionLevelDistributionPlot {...dataset} />
      <SCFindCellTypesChart {...dataset} />
    </Box>
  );
}
