import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TableCell, { TableCellProps } from '@mui/material/TableCell';

import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

function filterDisabledRows({
  allTableRowKeys,
  disabledTableRowKeys,
}: {
  allTableRowKeys: string[];
  disabledTableRowKeys?: Set<string>;
}) {
  if (!disabledTableRowKeys) {
    return allTableRowKeys;
  }
  return allTableRowKeys.filter((k) => !disabledTableRowKeys.has(k));
}

interface SelectableHeaderCellProps extends TableCellProps {
  allTableRowKeys: string[];
  disabledTableRowKeys?: Set<string>;
  disabled: boolean;
}

function SelectableHeaderCell({
  allTableRowKeys,
  disabledTableRowKeys,
  disabled = false,
  ...rest
}: SelectableHeaderCellProps) {
  const { toggleHeaderAndRows, headerRowIsSelected, tableLabel } = useSelectableTableStore();

  const filteredKeys = filterDisabledRows({ allTableRowKeys, disabledTableRowKeys });

  return (
    <TableCell padding="checkbox" {...rest}>
      <Checkbox
        color="secondary"
        checked={headerRowIsSelected}
        inputProps={{ 'aria-label': `${tableLabel}-header-row-checkbox` }}
        disabled={disabled || filteredKeys.length === 0}
        onChange={() => toggleHeaderAndRows(filteredKeys)}
      />
    </TableCell>
  );
}

export default SelectableHeaderCell;
