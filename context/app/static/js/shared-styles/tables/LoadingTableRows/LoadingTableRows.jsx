/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Skeleton from '@material-ui/lab/Skeleton';

// Using indexes as keys is an anti-pattern and can affect performance, but index can be used for items with no stable ID.
// A uuid generator cannot be used as keys need to be consistent through renders.
function LoadingTableRows({ numberOfRows, numberOfCols }) {
  return [...Array(numberOfRows).keys()].map((r, rowIndex) => (
    <TableRow key={`loading-table-row-${rowIndex}`}>
      {[...Array(numberOfCols).keys()].map((c, colIndex) => (
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
