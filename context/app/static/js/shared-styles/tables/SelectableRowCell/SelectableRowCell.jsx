import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';

import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';

function SelectableRowCell({ rowKey, index }) {
  const { toggleRow, selectedRows, tableLabel } = useStore();

  return (
    <TableCell padding="checkbox" onClick={() => toggleRow(rowKey)}>
      <Checkbox
        checked={selectedRows.has(rowKey)}
        inputProps={{ 'aria-labelledby': `${tableLabel}-row-${index}-checkbox` }}
      />
    </TableCell>
  );
}

export default SelectableRowCell;
