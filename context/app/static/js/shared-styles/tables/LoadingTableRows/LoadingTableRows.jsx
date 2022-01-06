import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Skeleton from '@material-ui/lab/Skeleton';

function LoadingTableRows({ numberOfRows, numberOfCols }) {
  return [...Array(numberOfRows).keys()].map(() => (
    <TableRow>
      {[...Array(numberOfCols).keys()].map(() => (
        <TableCell>
          <Skeleton />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export default LoadingTableRows;
