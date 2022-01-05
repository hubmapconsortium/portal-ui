import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import { HeaderCell } from 'js/shared-styles/tables';

function SelectableHeaderCell({ allTableRowKeys }) {
  const { deselectHeaderAndRows, setSelectedRows, headerRowIsSelected, selectHeaderRow, tableLabel } = useStore();

  function selectHeaderAndRows() {
    selectHeaderRow();
    setSelectedRows(allTableRowKeys);
  }
  return (
    <HeaderCell padding="checkbox" onClick={headerRowIsSelected ? deselectHeaderAndRows : selectHeaderAndRows}>
      <Checkbox checked={headerRowIsSelected} inputProps={{ 'aria-labelledby': `${tableLabel}-header-row-checkbox` }} />
    </HeaderCell>
  );
}

export default SelectableHeaderCell;
