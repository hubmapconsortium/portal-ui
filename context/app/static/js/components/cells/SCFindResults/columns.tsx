import React from 'react';
import Typography from '@mui/material/Typography';
import useCellTypeCountForDataset, { CellTypeCountsForDataset } from 'js/api/scfind/useCellTypeCountForDataset';
import { DatasetDocument } from 'js/typings/search';
import { decimal, percent } from 'js/helpers/number-format';
import { CellContentProps } from 'js/shared-styles/tables/columns';
import Skeleton from '@mui/material/Skeleton';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';

interface CellCountColumnProps {
  hit: DatasetDocument;
  display: (props: CellTypeCountsForDataset) => React.ReactNode;
}

function CellCountColumn({ hit: { hubmap_id }, display }: CellCountColumnProps) {
  const { data, isLoading } = useCellTypeCountForDataset({ dataset: hubmap_id });

  if (isLoading) {
    return <Skeleton variant="text" width={100} />;
  }
  if (!data) {
    return <div>No cell count data found for {hubmap_id}.</div>;
  }

  return display(data);
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
  return <CellCountColumn hit={hit} display={TargetCellTypeDisplay} />;
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
  return <CellCountColumn hit={hit} display={TotalCellTypeDisplay} />;
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
