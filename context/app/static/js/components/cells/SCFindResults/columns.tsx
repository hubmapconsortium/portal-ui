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

interface CellCountColumnProps {
  hit: DatasetDocument;
  renderDisplay: (props: CellTypeCountsForDataset) => React.ReactNode;
}

function CellCountColumn({ hit: { hubmap_id, uuid }, renderDisplay: Display }: CellCountColumnProps) {
  // TODO: Once we are able to switch between index versions, the dataset input will have to be updated accordingly
  // to handle the first version of the index using HBM IDs and subsequent versions using UUIDs
  // https://hms-dbmi.atlassian.net/browse/CAT-1339
  const { data, isLoading } = useCellTypeCountForDataset({ dataset: uuid });

  if (isLoading) {
    return <Skeleton variant="text" width={100} />;
  }
  if (!data) {
    return <div>No cell count data found for {hubmap_id}.</div>;
  }

  return <Display {...data} />;
}

function TargetCellTypeDisplay(data: CellTypeCountsForDataset) {
  const { cellTypeCounts } = data;
  const cellTypes = useCellVariableNames();
  const cellTypeCountsMap = cellTypeCounts.reduce(
    (acc, { index, count }) => {
      acc[index] = count;
      return acc;
    },
    {} as Record<string, number>,
  );
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

function TargetCellCountColumn({ hit }: CellContentProps<DatasetDocument>) {
  return <CellCountColumn hit={hit} renderDisplay={TargetCellTypeDisplay} />;
}

function TotalCellTypeDisplay(data: CellTypeCountsForDataset) {
  const { cellTypeCounts } = data;
  const totalCells = cellTypeCounts.reduce((acc, { count }) => acc + count, 0);

  return (
    <Typography variant="body2" component="p">
      {decimal.format(totalCells)}
    </Typography>
  );
}

function TotalCellCountColumn({ hit }: CellContentProps<DatasetDocument>) {
  return <CellCountColumn hit={hit} renderDisplay={TotalCellTypeDisplay} />;
}

export const targetCellCountColumn = {
  id: 'cell_count',
  label: 'Target Cell Count',
  cellContent: TargetCellCountColumn,
  noSort: true,
};

export const totalCellCountColumn = {
  id: 'total_cell_count',
  label: 'Total Cell Count',
  cellContent: TotalCellCountColumn,
  noSort: true,
};

function MatchingGeneColumn({ hit }: CellContentProps<DatasetDocument>) {
  const matchingGenes = useMatchingGeneContext()[hit.hubmap_id] ?? new Set<string>();
  const numberOfMatchingGenes = matchingGenes.size;

  const allGenes = useCellVariableNames();

  const allMatchingGenes = matchingGenes.size === allGenes.length;

  const text = allMatchingGenes ? 'All genes' : `${numberOfMatchingGenes} matching gene`;

  const pluralizedText = numberOfMatchingGenes > 1 && !allMatchingGenes ? `${text}s` : text;

  return (
    <SecondaryBackgroundTooltip title={`Matching genes: ${Array.from(matchingGenes).join(', ')}`}>
      <Typography variant="body2" component="p">
        {pluralizedText}
      </Typography>
    </SecondaryBackgroundTooltip>
  );
}

export const matchingGeneColumn = {
  id: 'matching_gene',
  label: 'Matching Genes',
  cellContent: MatchingGeneColumn,
  noSort: true,
};
