import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';

import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import { HeaderCell } from 'js/shared-styles/tables';

function SelectableHeaderCell({ allTableRowKeys, disabled }) {
  const { toggleHeaderAndRows, headerRowIsSelected, tableLabel } = useStore();

  return (
    <HeaderCell padding="checkbox">
      <Checkbox
        checked={headerRowIsSelected}
        inputProps={{ 'aria-label': `${tableLabel}-header-row-checkbox` }}
        disabled={disabled || allTableRowKeys.length === 0}
        onChange={() => toggleHeaderAndRows(allTableRowKeys)}
      />
    </HeaderCell>
  );
}

SelectableHeaderCell.propTypes = {
  /**
   Unique keys for all rows in the table.
  */
  allTableRowKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  disabled: PropTypes.bool,
};

SelectableHeaderCell.defaultProps = {
  disabled: false,
};

export default SelectableHeaderCell;
