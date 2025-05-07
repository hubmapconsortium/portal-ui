import React from 'react';

import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

function SelectableRowCell({
  rowKey,
  rowName,
  disabled = false,
  cellComponent: CellComponent = TableCell,
  onSelectChange,
}: {
  rowKey: string;
  rowName?: string;
  disabled?: boolean;
  cellComponent?: React.FunctionComponent | typeof TableCell;
  onSelectChange?: (event: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}) {
  const { toggleRow, selectedRows, tableLabel } = useSelectableTableStore();

  return (
    <CellComponent padding="checkbox" onClick={(e) => e.stopPropagation()}>
      <Checkbox
        color="secondary"
        checked={selectedRows.has(rowKey)}
        inputProps={{ 'aria-label': `${tableLabel}-row-${rowKey}-checkbox` }}
        onChange={(e) => {
          onSelectChange?.(e, rowName ?? rowKey);
          toggleRow(rowKey);
        }}
        disabled={disabled}
      />
    </CellComponent>
  );
}

export default SelectableRowCell;
