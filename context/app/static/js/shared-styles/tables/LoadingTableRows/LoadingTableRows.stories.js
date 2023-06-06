import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';

import LoadingTableRowsComponent from './LoadingTableRows';

export default {
  title: 'Tables/LoadingTableRows',
  component: LoadingTableRowsComponent,
};

export function LoadingTableRows(args) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>A</TableCell>
          <TableCell>B</TableCell>
          <TableCell>C</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <LoadingTableRowsComponent {...args} />
      </TableBody>
    </Table>
  );
}
LoadingTableRows.args = { numberOfRows: 3, numberOfCols: 3 };

LoadingTableRows.storyName = 'LoadingTableRows'; // needed for single story hoisting for multi word component names
