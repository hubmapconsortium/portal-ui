import React, { useMemo } from 'react';

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
import { GeneSignatureStats } from 'js/api/scfind/useHyperQueryCellTypes';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
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

// Enhanced interface to support gene-specific highlighting
interface GeneHighlightInfo {
  gene: string;
  color: string;
  cellTypes: string[];
}

interface CellTypesChartProps {
  totalCells: number;
  cellTypeCounts: CellTypeCounts;
  isLoading: boolean;
  cellNames: string[];
  title?: React.ReactNode;
  geneHighlights?: GeneHighlightInfo[];
  showLegend?: boolean;
}

const margin = {
  top: 20,
  right: 20,
  bottom: 220,
  left: 80,
} as const;

function CellTypesChart({
  totalCells,
  cellTypeCounts,
  isLoading,
  cellNames: _cellNames,
  title,
  geneHighlights = [],
  showLegend = false,
}: CellTypesChartProps) {
  // Get all highlighted cell types
  const highlightedCellTypes = useMemo(() => {
    return geneHighlights.flatMap(({ cellTypes }) => cellTypes);
  }, [geneHighlights]);

  return (
    <Box p={2} width="100%">
      {showLegend && geneHighlights.length > 0 && (
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Gene-Associated Cell Types:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {geneHighlights.map(({ gene, color }) => (
              <Chip
                key={gene}
                label={gene}
                size="small"
                sx={{
                  backgroundColor: color,
                  color: 'white',
                  '& .MuiChip-label': { fontWeight: 600 },
                }}
              />
            ))}
          </Stack>
        </Box>
      )}
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
              highlightedKeys={highlightedCellTypes}
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

export function SCFindCellTypesChart({
  uuid,
  hyperQueryData,
  hyperQueryLoading,
  currentGene,
  queriedGenes = [],
}: Dataset & {
  hyperQueryData?: { findGeneSignatures: GeneSignatureStats[] };
  hyperQueryLoading?: boolean;
  currentGene?: string;
  queriedGenes?: string[];
}) {
  const cellVariableNames = useCellVariableNames();
  const { data, isLoading } = useCellTypeCountForDataset({ dataset: uuid });
  const cellNames = useMemo(() => {
    return cellVariableNames.map((cellTypeName) => cellTypeName.split('.')[1]).filter(Boolean);
  }, [cellVariableNames]);

  // Process hyperquery data to create gene highlights
  const geneHighlights = useMemo(() => {
    if (!hyperQueryData?.findGeneSignatures) {
      return [];
    }

    const highlights: GeneHighlightInfo[] = [];

    // Define colors for different genes
    const geneColors = [
      '#4B5F27', // Primary green highlight color
      '#7B68EE', // Medium slate blue
      '#FF6B6B', // Light red
      '#4ECDC4', // Teal
      '#FFE66D', // Yellow
      '#FF8B94', // Pink
      '#95E1D3', // Mint
      '#C7CEEA', // Lavender
    ];

    if (currentGene) {
      // Single gene mode: use primary color for the current gene
      const relevantSignatures = hyperQueryData.findGeneSignatures.filter(
        (sig) => sig.pval < 0.05, // Only include statistically significant results
      );

      if (relevantSignatures.length > 0) {
        highlights.push({
          gene: currentGene,
          color: geneColors[0],
          cellTypes: relevantSignatures.map((sig) => sig.cell_type.split('.')[1]).filter(Boolean),
        });
      }
    } else {
      // Multi-gene mode: assign different colors to each gene
      // Group signatures by gene (we need to deduce which gene each signature belongs to)
      // Since the hyperquery includes all genes, we'll use the query order to assign colors
      queriedGenes.forEach((gene, index) => {
        const relevantSignatures = hyperQueryData.findGeneSignatures.filter(
          (sig) => sig.pval < 0.05, // Only include statistically significant results
        );

        if (relevantSignatures.length > 0) {
          highlights.push({
            gene,
            color: geneColors[index % geneColors.length],
            cellTypes: relevantSignatures.map((sig) => sig.cell_type.split('.')[1]).filter(Boolean),
          });
        }
      });
    }

    return highlights;
  }, [hyperQueryData, currentGene, queriedGenes]);

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
      isLoading={isLoading || Boolean(hyperQueryLoading)}
      cellNames={cellNames}
      geneHighlights={geneHighlights}
      showLegend={geneHighlights.length >= 1}
    />
  );
}

export default CellTypesChart;
