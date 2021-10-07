import React from 'react';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import EntitiesTableComponent from './EntitiesTable';

export default {
  title: 'Tables/EntitiesTable',
  component: EntitiesTableComponent,
};

export const EntitiesTable = () => {
  return (
    <EntitiesTableComponent columns={['name', 'color', 'stripes'].map((s) => ({ id: s, label: s }))}>
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
    </EntitiesTableComponent>
  );
};

EntitiesTable.storyName = 'EntitiesTable'; // needed for single story hoisting for multi word component names
