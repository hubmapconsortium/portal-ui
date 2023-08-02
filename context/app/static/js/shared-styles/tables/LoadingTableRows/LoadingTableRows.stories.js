import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

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
