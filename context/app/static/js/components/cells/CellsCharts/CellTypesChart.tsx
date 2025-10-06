import React, { useMemo } from 'react';

import BarChart from 'js/shared-styles/charts/BarChart';
import ChartLoader from 'js/shared-styles/charts/ChartLoader';
import { TooltipData } from 'js/shared-styles/charts/types';
import { createContext, useContext } from 'js/helpers/context';
import useCellTypeCountForDataset from 'js/api/scfind/useCellTypeCountForDataset';
import { Dataset } from 'js/components/types';
import Typography from '@mui/material/Typography';
import { decimal, percent } from 'js/helpers/number-format';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import { useCellTypesChartsData } from './hooks';
import { extractLabel } from '../CrossModalityResults/utils';
import { useCellVariableNames, useIsQueryType } from '../MolecularDataQueryForm/hooks';
import Stack from '@mui/material/Stack';
import { scaleOrdinal } from '@visx/scale';
import { useTheme } from '@mui/material/styles';
import ChartWrapper from 'js/shared-styles/charts/ChartWrapper';
import { extractCellTypeInfo } from 'js/api/scfind/utils';
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

function GeneTooltipContent({
  tooltipData,
  cellTypeGeneAssociations = [],
}: {
  tooltipData: TooltipData<{ value: number }>;
  cellTypeGeneAssociations?: CellTypeGeneAssociation[];
}) {
  const totalCells = useTotalCells();

  if (!tooltipData.bar) {
    return tooltipData.key;
  }

  const cellType = tooltipData.key;
  const count = tooltipData.bar.data.value;

  // Find gene associations for this cell type
  const geneAssociation = cellTypeGeneAssociations.find((association) => association.cellType === cellType);

  return (
    <>
      <Typography variant="body2" fontWeight="bold">
        {cellType}
      </Typography>
      <Typography variant="body2">
        {decimal.format(count)} cells ({percent.format(count / totalCells)})
      </Typography>
      {geneAssociation && geneAssociation.genes.length > 0 && (
        <>
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
            Associated genes:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {geneAssociation.genes.join(', ')}
          </Typography>
        </>
      )}
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

interface CellTypeGeneAssociation {
  cellType: string;
  genes: string[];
  colors: string[];
}

interface CellTypesChartProps {
  totalCells: number;
  cellTypeCounts: CellTypeCounts;
  isLoading: boolean;
  cellNames: string[];
  title?: React.ReactNode;
  geneHighlights?: GeneHighlightInfo[];
  cellTypeGeneAssociations?: CellTypeGeneAssociation[];
}

const margin = {
  top: 20,
  right: 20,
  bottom: 300,
  left: 80,
} as const;

function CellTypesChart({
  totalCells,
  cellTypeCounts,
  isLoading,
  cellNames,
  title,
  geneHighlights = [],
  cellTypeGeneAssociations = [],
}: CellTypesChartProps) {
  const isGeneQuery = geneHighlights.length > 0;
  // Get all highlighted cell types
  const highlightedCellTypes = useMemo(() => {
    if (isGeneQuery) {
      return geneHighlights.flatMap(({ cellTypes }) => cellTypes);
    }
    return cellNames.map((name) => extractCellTypeInfo(name).name).filter(Boolean);
  }, [geneHighlights, cellNames, isGeneQuery]);

  const theme = useTheme();

  const [showLegend, legendScale] = useMemo(() => {
    if (geneHighlights.length === 0) {
      return [false, undefined];
    }
    return [
      true,
      scaleOrdinal<string, string>({
        domain: ['Unmatched', ...geneHighlights.map(({ gene }) => gene), 'Multiple'],
        range: [theme.palette.graphs.unmatched, ...geneHighlights.map(({ color }) => color), 'placeholder'],
      }),
    ];
  }, [geneHighlights, theme]);

  // Create tooltip component that shows gene associations if available
  const TooltipComponent = useMemo(() => {
    if (cellTypeGeneAssociations.length > 0) {
      const GeneTooltipWrapper = (props: { tooltipData: TooltipData<{ value: number }> }) => (
        <GeneTooltipContent {...props} cellTypeGeneAssociations={cellTypeGeneAssociations} />
      );
      GeneTooltipWrapper.displayName = 'GeneTooltipWrapper';
      return GeneTooltipWrapper;
    }
    return CellTypesChartTooltip;
  }, [cellTypeGeneAssociations]);

  return (
    <ChartWrapper
      sx={{
        p: 2,
        width: '100%',
      }}
      margin={margin}
      colorScale={legendScale}
      dropdown={
        showLegend && (
          <InfoTextTooltip tooltipTitle="These cell types are associated with specific gene signatures.">
            <Typography variant="subtitle2" gutterBottom>
              Gene-Associated Cell&nbsp;Types
            </Typography>
          </InfoTextTooltip>
        )
      }
      fullWidthGraph={!showLegend}
    >
      <TotalCellsContext.Provider value={totalCells}>
        <ChartLoader isLoading={isLoading}>
          {title && (
            <Typography variant="subtitle2" display="flex" alignItems="center">
              {title}
            </Typography>
          )}
          <Stack direction="row" spacing={1} alignItems="center" height="600px" pl={2}>
            <BarChart
              data={cellTypeCounts}
              highlightedKeys={highlightedCellTypes}
              yAxisLabel="Count"
              xAxisLabel="Cell Type"
              margin={margin}
              TooltipContent={TooltipComponent}
              multiGeneAssociations={cellTypeGeneAssociations}
            />
          </Stack>
        </ChartLoader>
      </TotalCellsContext.Provider>
    </ChartWrapper>
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
  hyperQueryLoading,
  geneHighlights = [],
  cellTypeGeneAssociations = [],
}: Dataset & {
  geneHighlights?: GeneHighlightInfo[];
  cellTypeGeneAssociations?: CellTypeGeneAssociation[];
}) {
  const cellVariableNames = useCellVariableNames();
  const { data, isLoading } = useCellTypeCountForDataset({ dataset: uuid });
  const isCellTypesQuery = useIsQueryType('cell-type');
  const cellNames = useMemo(() => {
    if (isCellTypesQuery) {
      return cellVariableNames.map((cellTypeName) => extractLabel(cellTypeName)).filter(Boolean);
    }
    return [];
  }, [cellVariableNames, isCellTypesQuery]);

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
        <InfoTextTooltip tooltipTitle="Plot showing the distribution of cell types in the dataset, with any cell types of interest emphasized.">
          Cell Type Distribution Plot
        </InfoTextTooltip>
      }
      totalCells={totalCells}
      cellTypeCounts={cellTypeCounts}
      isLoading={isLoading || Boolean(hyperQueryLoading)}
      cellNames={cellNames}
      geneHighlights={geneHighlights}
      cellTypeGeneAssociations={cellTypeGeneAssociations}
    />
  );
}

export default CellTypesChart;
