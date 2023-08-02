import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell/';
import SelectableTableProviderComponent from './SelectableTableProvider';
import { useStore } from './store';

export default {
  title: 'Tables/SelectableTableProvider',
  component: SelectableTableProviderComponent,
  subcomponents: { SelectableHeaderCell, SelectableRowCell },
  excludeStories: ['tableLabel', 'rowKeys'],
};

export const rowKeys = ['A', 'B', 'C'];

function ExampleTable() {
  const { selectedRows } = useStore();
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <SelectableHeaderCell allTableRowKeys={rowKeys} />
            <TableCell>Key</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowKeys.map((rowKey) => (
            <TableRow key={rowKey}>
              <SelectableRowCell rowKey={rowKey} />
              <TableCell>{rowKey}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography>You have selected rows {[...selectedRows].join(', ')}.</Typography>
    </div>
  );
}

export function SelectableTableProvider(args) {
  return (
    <SelectableTableProviderComponent {...args}>
      <ExampleTable />
    </SelectableTableProviderComponent>
  );
}

export const tableLabel = 'selectableTableExample';
SelectableTableProvider.args = {
  tableLabel,
};

SelectableTableProvider.storyName = 'SelectableTableProvider'; // needed for single story hoisting for multi word component names
