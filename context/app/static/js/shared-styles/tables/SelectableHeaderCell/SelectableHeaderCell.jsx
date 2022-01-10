import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';

import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import { HeaderCell } from 'js/shared-styles/tables';

function SelectableHeaderCell({ allTableRowKeys }) {
  const { toggleHeaderAndRows, headerRowIsSelected, tableLabel } = useStore();

  return (
    <HeaderCell padding="checkbox" onClick={() => toggleHeaderAndRows(allTableRowKeys)}>
      <Checkbox checked={headerRowIsSelected} inputProps={{ 'aria-label': `${tableLabel}-header-row-checkbox` }} />
    </HeaderCell>
  );
}

SelectableHeaderCell.propTypes = {
  /**
   Unique keys for all rows in the table.
  */
  allTableRowKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default SelectableHeaderCell;
