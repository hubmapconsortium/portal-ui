import React from 'react';

import { HeaderCell } from 'js/shared-styles/tables';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import EntitiesTableComponent from './EntitiesTable';

export default {
  title: 'Tables/EntitiesTable',
  component: EntitiesTableComponent,
};

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

export function EntitiesTable(args) {
  return <EntitiesTableComponent {...args} />;
}

EntitiesTable.args = {
  headerCells: <HeaderCells />,
  tableRows: <TableRows />,
};

EntitiesTable.storyName = 'EntitiesTable'; // needed for single story hoisting for multi word component names
