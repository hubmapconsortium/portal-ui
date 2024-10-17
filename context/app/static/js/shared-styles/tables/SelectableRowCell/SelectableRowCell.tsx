import React from 'react';

import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

function SelectableRowCell({
  rowKey,
  disabled = false,
  cellComponent: CellComponent = TableCell,
}: {
  rowKey: string;
  disabled?: boolean;
  cellComponent?: React.FunctionComponent | typeof TableCell;
}) {
  const { toggleRow, selectedRows, tableLabel } = useSelectableTableStore();

  return (
    <CellComponent padding="checkbox">
      <Checkbox
        color="secondary"
        checked={selectedRows.has(rowKey)}
        inputProps={{ 'aria-label': `${tableLabel}-row-${rowKey}-checkbox` }}
        onChange={() => toggleRow(rowKey)}
        disabled={disabled}
      />
    </CellComponent>
  );
}

export default SelectableRowCell;
