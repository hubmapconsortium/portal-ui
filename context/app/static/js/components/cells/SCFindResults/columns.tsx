import React from 'react';
import Typography from '@mui/material/Typography';
import useCellTypeCountForDataset from 'js/api/scfind/useCellTypeCountForDataset';
import { DatasetDocument } from 'js/typings/search';
import { decimal, percent } from 'js/helpers/number-format';
import { CellContentProps } from 'js/shared-styles/tables/columns';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';

function TargetCellCountColumn({ hit: { hubmap_id } }: CellContentProps<DatasetDocument>) {
  const { data, isLoading } = useCellTypeCountForDataset({ dataset: hubmap_id });
  const cellTypes = useCellVariableNames();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>No data</div>;
  }
  const { cellTypeCounts } = data;
  const cellTypeCountsMap = cellTypeCounts.reduce(
    (acc, { index, count }) => {
      acc[index] = count;
      return acc;
    },
    {} as Record<string, number>,
  );
  const totalCells = cellTypeCounts.reduce((acc, { count }) => acc + count, 0);

  return (
    <div>
      {Object.entries(cellTypeCountsMap).map(([cellType, count]) =>
        cellTypes.includes(cellType) ? (
          <Typography key={cellType} variant="body2" component="p">
            {cellType.split('.')[1]}: {count} ({percent.format(count / totalCells)})
          </Typography>
        ) : null,
      )}
    </div>
  );
}

function TotalCellCountColumn({ hit: { hubmap_id } }: CellContentProps<DatasetDocument>) {
  const { data, isLoading } = useCellTypeCountForDataset({ dataset: hubmap_id });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>No data</div>;
  }
  const { cellTypeCounts } = data;
  const totalCells = cellTypeCounts.reduce((acc, { count }) => acc + count, 0);

  return (
    <Typography variant="body2" component="p">
      {decimal.format(totalCells)}
    </Typography>
  );
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
