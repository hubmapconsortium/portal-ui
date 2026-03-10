import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { HeaderCell } from 'js/shared-styles/tables';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import EntitiesTableComponent from './EntitiesTable';

function HeaderCells() {
  return (
    <>
      <HeaderCell>name</HeaderCell>
      <HeaderCell>color</HeaderCell>
      <HeaderCell>stripes</HeaderCell>
    </>
  );
}

function TableRows() {
  return (
    <>
      <TableRow key="bert">
        <TableCell>Bert</TableCell>
        <TableCell>yellow</TableCell>
        <TableCell>vertical</TableCell>
      </TableRow>
      <TableRow key="bert">
        <TableCell>Ernie</TableCell>
        <TableCell>orange</TableCell>
        <TableCell>horizontal</TableCell>
      </TableRow>
    </>
  );
}

const meta = {
  title: 'Tables/EntitiesTable',
  component: EntitiesTableComponent,
} satisfies Meta<typeof EntitiesTableComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EntitiesTable: Story = {
  args: {
    headerCells: <HeaderCells />,
    tableRows: <TableRows />,
  },
};
