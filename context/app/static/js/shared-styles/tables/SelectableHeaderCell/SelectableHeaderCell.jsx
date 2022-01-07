import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import { HeaderCell } from 'js/shared-styles/tables';

function SelectableHeaderCell({ allTableRowKeys }) {
  const { toggleHeaderAndRows, headerRowIsSelected, tableLabel } = useStore();

  return (
    <HeaderCell padding="checkbox" onClick={() => toggleHeaderAndRows(allTableRowKeys)}>
      <Checkbox checked={headerRowIsSelected} inputProps={{ 'aria-labelledby': `${tableLabel}-header-row-checkbox` }} />
    </HeaderCell>
  );
}

export default SelectableHeaderCell;
