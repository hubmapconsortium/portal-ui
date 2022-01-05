import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import { HeaderCell } from 'js/shared-styles/tables';

function SelectableHeaderCell({ allTableRowKeys }) {
  const {
    deselectAllRows,
    setSelectedRows,
    headerRowIsSelected,
    selectHeaderRow,
    deselectHeaderRow,
    tableLabel,
  } = useStore();

  function checkHeaderRow() {
    selectHeaderRow();
    setSelectedRows(allTableRowKeys);
  }

  function uncheckHeaderRow() {
    deselectHeaderRow();
    deselectAllRows();
  }
  return (
    <HeaderCell padding="checkbox" onClick={headerRowIsSelected ? uncheckHeaderRow : checkHeaderRow}>
      <Checkbox checked={headerRowIsSelected} inputProps={{ 'aria-labelledby': `${tableLabel}-header-row-checkbox` }} />
    </HeaderCell>
  );
}

export default SelectableHeaderCell;
