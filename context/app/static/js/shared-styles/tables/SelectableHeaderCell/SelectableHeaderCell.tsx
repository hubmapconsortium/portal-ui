import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TableCell, { TableCellProps } from '@mui/material/TableCell';

import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

interface SelectableHeaderCellProps extends TableCellProps {
  allTableRowKeys: string[];
  disabled: boolean;
}

function SelectableHeaderCell({ allTableRowKeys, disabled = false, ...rest }: SelectableHeaderCellProps) {
  const { toggleHeaderAndRows, headerRowIsSelected, tableLabel } = useSelectableTableStore();

  return (
    <TableCell padding="checkbox" {...rest}>
      <Checkbox
        color="secondary"
        checked={headerRowIsSelected}
        inputProps={{ 'aria-label': `${tableLabel}-header-row-checkbox` }}
        disabled={disabled || allTableRowKeys.length === 0}
        onChange={() => toggleHeaderAndRows(allTableRowKeys)}
      />
    </TableCell>
  );
}

export default SelectableHeaderCell;
