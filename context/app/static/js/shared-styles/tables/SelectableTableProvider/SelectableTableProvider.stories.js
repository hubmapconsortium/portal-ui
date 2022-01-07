import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';

import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell/';
import SelectableTableProviderComponent from './SelectableTableProvider';
import { useStore } from './store';

export default {
  title: 'Tables/SelectableTableProvider',
  component: SelectableTableProviderComponent,
  subcomponents: { SelectableHeaderCell, SelectableRowCell },
};

const rowKeys = ['A', 'B', 'C'];

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
          {rowKeys.map((rowKey, i) => (
            <TableRow key={rowKey}>
              <SelectableRowCell rowKey={rowKey} index={i} />
              <TableCell>{rowKey}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Typography>You have selected rows {[...selectedRows].join(', ')}.</Typography>
    </div>
  );
}

export const SelectableTableProvider = (args) => (
  <SelectableTableProviderComponent {...args}>
    <ExampleTable />
  </SelectableTableProviderComponent>
);
SelectableTableProvider.args = {
  tableLabel: 'defaultStory',
};

SelectableTableProvider.storyName = 'SelectableTableProvider'; // needed for single story hoisting for multi word component names
