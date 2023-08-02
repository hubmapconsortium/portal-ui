/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';

import { getArrayRange } from 'js/helpers/functions';

// Using indexes as keys is an anti-pattern and can affect performance, but index can be used for items with no stable ID.
// A uuid generator cannot be used as keys need to be consistent through renders.
function LoadingTableRows({ numberOfRows, numberOfCols }) {
  return getArrayRange(numberOfRows).map((r, rowIndex) => (
    <TableRow key={`loading-table-row-${rowIndex}`}>
      {getArrayRange(numberOfCols).map((c, colIndex) => (
        <TableCell key={`loading-table-row-${colIndex}`}>
          <Skeleton />
        </TableCell>
      ))}
    </TableRow>
  ));
}

LoadingTableRows.propTypes = {
  numberOfRows: PropTypes.number.isRequired,
  numberOfCols: PropTypes.number.isRequired,
};

export default LoadingTableRows;
