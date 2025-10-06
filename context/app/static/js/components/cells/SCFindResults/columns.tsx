import React from 'react';
import Typography from '@mui/material/Typography';
import useCellTypeCountForDataset, { CellTypeCountsForDataset } from 'js/api/scfind/useCellTypeCountForDataset';
import { DatasetDocument } from 'js/typings/search';
import { decimal, percent } from 'js/helpers/number-format';
import { CellContentProps } from 'js/shared-styles/tables/columns';
import Skeleton from '@mui/material/Skeleton';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';
import { useMatchingGeneContext } from './MatchingGeneContext';
import { useGeneCountsContext } from './GeneCountsContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useOptionalGeneContext } from './CurrentGeneContext';

interface CellCountColumnProps {
  hit: DatasetDocument;
  renderDisplay: (props: CellTypeCountsForDataset) => React.ReactNode;
}

/**
 * Helper wrapper which fetches cell type counts for a dataset and renders them using the provided display component.
 */
function CellCountColumn({ hit: { hubmap_id, uuid }, renderDisplay: Display }: CellCountColumnProps) {
  const { data, isLoading } = useCellTypeCountForDataset({ dataset: uuid });

  if (isLoading) {
    return <Skeleton variant="text" width={100} />;
  }
  if (!data) {
    return <div>No cell count data found for {hubmap_id}.</div>;
  }

  return <Display {...data} />;
}

/**
 * Displays the target cell type counts for a dataset.
 * Receives the cell type counts data as props from CellCountColumn.
 */
function TargetCellTypeDisplay(data: CellTypeCountsForDataset) {
  const { cellTypeCounts } = data;
  const cellTypes = useCellVariableNames();
  const cellTypeCountsMap = cellTypeCounts.reduce<Record<string, number>>((acc, { index, count }) => {
    acc[index] = count;
    return acc;
  }, {});
  const totalCells = cellTypeCounts.reduce((acc, { count }) => acc + count, 0);
  return (
    <>
      {Object.entries(cellTypeCountsMap).map(([cellType, count]) =>
        cellTypes.includes(cellType) ? (
          <Typography key={cellType} variant="body2" component="p">
            {cellType.split('.')[1]}: {count} ({percent.format(count / totalCells)})
          </Typography>
        ) : null,
      )}
    </>
  );
}

/**
 * Displays the target cell type counts for a dataset.
 * If a customSortValues map is provided, it uses the values from that map instead of fetching from the API.
 */
function TargetCellCountColumn({
  hit,
  customSortValues,
  totalCountsMap,
}: CellContentProps<DatasetDocument> & {
  customSortValues?: Record<string, number | string>;
  totalCountsMap?: Record<string, number | string>;
}) {
  // If we have custom sort values, use them directly instead of fetching from API
  if (customSortValues && totalCountsMap) {
    const targetCount = customSortValues[hit.uuid];
    const totalCount = totalCountsMap[hit.uuid];

    if (
      targetCount !== undefined &&
      totalCount !== undefined &&
      typeof targetCount === 'number' &&
      typeof totalCount === 'number'
    ) {
      const percentage = totalCount > 0 ? targetCount / totalCount : 0;

      // For categorized data, show breakdown in tooltip
      const tooltipContent = (
        <div>
          <Typography variant="body2" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
            Target Cell Types in {hit.hubmap_id}:
          </Typography>
          <Typography variant="body2" component="div" sx={{ mb: 1 }}>
            Total: {decimal.format(targetCount)} / {decimal.format(totalCount)}
          </Typography>
          <CellCountColumn hit={hit} renderDisplay={TargetCellTypeDisplay} />
        </div>
      );

      return (
        <SecondaryBackgroundTooltip title={tooltipContent}>
          <Typography variant="body2" component="p">
            {percent.format(percentage)}
          </Typography>
        </SecondaryBackgroundTooltip>
      );
    }
  }

  return <CellCountColumn hit={hit} renderDisplay={TargetCellTypeDisplay} />;
}

/**
 * Displays the total cell type counts for a dataset.
 * Receives the cell type counts data as props from CellCountColumn.
 */
function TotalCellTypeDisplay(data: CellTypeCountsForDataset) {
  const { cellTypeCounts } = data;
  const totalCells = cellTypeCounts.reduce((acc, { count }) => acc + count, 0);

  return (
    <Typography variant="body2" component="span">
      {decimal.format(totalCells)}
    </Typography>
  );
}

/**
 * Displays the total cell type counts for a dataset.
 * If a customSortValues map is provided, it uses the values from that map instead of fetching from the API.
 */
function TotalCellCountColumn({
  hit,
  customSortValues,
}: CellContentProps<DatasetDocument> & { customSortValues?: Record<string, number | string> }) {
  // If we have custom sort values, display them directly instead of fetching from API
  if (customSortValues) {
    const cellCount = customSortValues[hit.uuid];

    if (cellCount !== undefined) {
      return (
        <Typography variant="body2" component="span">
          {typeof cellCount === 'number' ? decimal.format(cellCount) : cellCount}
        </Typography>
      );
    }
  }

  return <CellCountColumn hit={hit} renderDisplay={TotalCellTypeDisplay} />;
}

export const targetCellCountColumn = (
  customSortValues?: Record<string, number | string>,
  totalCountsMap?: Record<string, number | string>,
) => ({
  id: 'target_cell_count',
  label: 'Target Cell %',
  cellContent: (props: CellContentProps<DatasetDocument>) => (
    <TargetCellCountColumn {...props} customSortValues={customSortValues} totalCountsMap={totalCountsMap} />
  ),
  width: 150,
  customSortValues:
    totalCountsMap && customSortValues
      ? Object.fromEntries(
          Object.entries(customSortValues).map(([uuid, targetCount]) => {
            const totalCount = totalCountsMap[uuid];
            if (typeof targetCount === 'number' && typeof totalCount === 'number' && totalCount > 0) {
              return [uuid, targetCount / totalCount];
            }
            return [uuid, 0];
          }),
        )
      : customSortValues,
});

export const totalCellCountColumn = (customSortValues?: Record<string, number | string>) => ({
  id: 'total_cell_count',
  label: 'Total Cell Count',
  cellContent: (props: CellContentProps<DatasetDocument>) => (
    <TotalCellCountColumn {...props} customSortValues={customSortValues} />
  ),
  width: 150,
  customSortValues,
});

interface GeneWithCount {
  gene: string;
  count: number;
}

/**
 * Creates tooltip content with genes and their counts
 * @returns `{count A} cells expressing {gene name A}, {count B} cells expressing {gene name B}, ...`
 */
const useMatchingGenesTooltipText = (genesWithCounts: GeneWithCount[]) => {
  return (
    <List dense>
      {genesWithCounts.map(({ gene, count }) => (
        <ListItem key={gene} disablePadding>
          <Typography variant="body2" component="span">
            {decimal.format(count)} cells expressing {gene}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
};

/**
 * Displays column content for a single matching gene in a dataset.
 * Shows the percentage of cells expressing that specific gene.
 */
function MatchingGeneColumn({
  hit,
  totalCountsMap,
}: CellContentProps<DatasetDocument> & {
  totalCountsMap?: Record<string, number | string>;
}) {
  const individualGene = useOptionalGeneContext();
  const geneCountsData = useGeneCountsContext();

  if (!individualGene) {
    return null;
  }

  const geneCount = Number(
    geneCountsData[individualGene]?.[hit.hubmap_id] || geneCountsData[individualGene]?.[hit.uuid] || 0,
  );

  const totalCount = totalCountsMap ? Number(totalCountsMap[hit.uuid] || 0) : 0;
  const percentage = totalCount > 0 ? geneCount / totalCount : 0;

  // Show percentage with raw counts in tooltip
  const tooltipContent = (
    <div>
      <Typography variant="body2" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
        {individualGene} Expression in {hit.hubmap_id}:
      </Typography>
      <Typography variant="body2" component="div">
        {decimal.format(geneCount)} cells expressing {individualGene} out of {decimal.format(totalCount)} total cells
      </Typography>
    </div>
  );

  return (
    <SecondaryBackgroundTooltip title={tooltipContent}>
      <Typography variant="body2" component="p">
        {percent.format(percentage)}
      </Typography>
    </SecondaryBackgroundTooltip>
  );
}

/**
 * Displays column content for multiple matching genes in a dataset.
 * Shows the count of matching genes and detailed counts in tooltip.
 */
function MatchingGenesColumn({ hit }: CellContentProps<DatasetDocument>) {
  const matchingGenes = useMatchingGeneContext()[hit.uuid] ?? new Set<string>();
  const geneCountsData = useGeneCountsContext();
  const numberOfMatchingGenes = matchingGenes.size;

  const allGenes = useCellVariableNames();
  const allMatchingGenes = matchingGenes.size === allGenes.length;

  // Get counts for each matching gene and sort by count (descending)
  const genesWithCounts = Array.from(matchingGenes)
    .map((gene) => ({
      gene,
      count: Number(geneCountsData[gene]?.[hit.hubmap_id] || geneCountsData[gene]?.[hit.uuid] || 0),
    }))
    .sort((a, b) => b.count - a.count);

  const text = allMatchingGenes ? 'All genes' : `${numberOfMatchingGenes} matching gene`;
  const pluralizedText = numberOfMatchingGenes > 1 && !allMatchingGenes ? `${text}s` : text;

  const tooltipContent = useMatchingGenesTooltipText(genesWithCounts);

  return (
    <SecondaryBackgroundTooltip title={tooltipContent}>
      <Typography variant="body2" component="p">
        {pluralizedText}
      </Typography>
    </SecondaryBackgroundTooltip>
  );
}

export const matchingGeneColumn = (
  countsMap?: Record<string, number | string>,
  totalCountsMap?: Record<string, number | string>,
) => ({
  id: 'matching_gene',
  label: 'Matching Gene %',
  cellContent: (props: CellContentProps<DatasetDocument>) => (
    <MatchingGeneColumn {...props} totalCountsMap={totalCountsMap} />
  ),
  width: 150,
  customSortValues:
    totalCountsMap && countsMap
      ? Object.fromEntries(
          Object.entries(countsMap).map(([uuid, geneCount]) => {
            const totalCount = totalCountsMap[uuid];
            if (typeof geneCount === 'number' && typeof totalCount === 'number' && totalCount > 0) {
              return [uuid, geneCount / totalCount];
            }
            return [uuid, 0];
          }),
        )
      : countsMap,
});

export const matchingGenesColumn = (countsMap?: Record<string, number | string>) => ({
  id: 'matching_genes',
  label: 'Matching Genes',
  cellContent: MatchingGenesColumn,
  width: 150,
  customSortValues: countsMap,
});
