import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import { HeaderCell } from 'js/shared-styles/tables';

function SelectableHeaderCell({ allTableRowKeys, disabled }) {
  const { toggleHeaderAndRows, headerRowIsSelected, tableLabel } = useStore();

  return (
    <HeaderCell padding="checkbox">
      <Checkbox
        checked={headerRowIsSelected}
        inputProps={{ 'aria-labelledby': `${tableLabel}-header-row-checkbox` }}
        disabled={disabled || allTableRowKeys.length === 0}
        onChange={() => toggleHeaderAndRows(allTableRowKeys)}
      />
    </HeaderCell>
  );
}

export default SelectableHeaderCell;
