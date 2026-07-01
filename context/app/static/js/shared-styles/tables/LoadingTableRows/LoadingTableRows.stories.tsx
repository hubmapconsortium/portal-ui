import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import LoadingTableRowsComponent from './LoadingTableRows';

const meta = {
  title: 'Tables/LoadingTableRows',
  component: LoadingTableRowsComponent,
} satisfies Meta<typeof LoadingTableRowsComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoadingTableRows: Story = {
  args: { numberOfRows: 3, numberOfCols: 3 },
  render: (args) => (
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
  ),
};
