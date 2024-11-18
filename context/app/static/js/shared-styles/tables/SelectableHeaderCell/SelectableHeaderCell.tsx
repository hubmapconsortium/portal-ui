import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TableCell, { TableCellProps } from '@mui/material/TableCell';

import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';

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
  selectTooltip?: string;
  deselectTooltip?: string;
}

function SelectableHeaderCell({
  allTableRowKeys,
  disabledTableRowKeys,
  selectTooltip,
  deselectTooltip,
  disabled = false,
  ...rest
}: SelectableHeaderCellProps) {
  const { toggleHeaderAndRows, headerRowIsSelected, tableLabel } = useSelectableTableStore();

  const filteredKeys = filterDisabledRows({ allTableRowKeys, disabledTableRowKeys });

  const content = (
    <Checkbox
      color="secondary"
      checked={headerRowIsSelected}
      inputProps={{ 'aria-label': `${tableLabel}-header-row-checkbox` }}
      disabled={disabled || filteredKeys.length === 0}
      onChange={() => toggleHeaderAndRows(filteredKeys)}
    />
  );

  if (selectTooltip && deselectTooltip) {
    return (
      <TableCell padding="checkbox" {...rest}>
        <SecondaryBackgroundTooltip title={headerRowIsSelected ? deselectTooltip : selectTooltip}>
          {content}
        </SecondaryBackgroundTooltip>
      </TableCell>
    );
  }

  return (
    <TableCell padding="checkbox" {...rest}>
      {content}
    </TableCell>
  );
}

export default SelectableHeaderCell;
