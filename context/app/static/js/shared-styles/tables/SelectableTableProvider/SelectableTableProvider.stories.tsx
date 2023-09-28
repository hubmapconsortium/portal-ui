import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell/';
import SelectableTableProviderComponent, { useSelectableTableStore } from './SelectableTableProvider';

export default {
  title: 'Tables/SelectableTableProvider',
  component: SelectableTableProviderComponent,
  subcomponents: { SelectableHeaderCell, SelectableRowCell },
  excludeStories: ['tableLabel', 'rowKeys'],
};

export const rowKeys = ['A', 'B', 'C'];
export const tableLabel = 'Example Table';

function ExampleTable() {
  const selectedRows = useSelectableTableStore((state) => state.selectedRows);

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <SelectableHeaderCell disabled={false} allTableRowKeys={rowKeys} />
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
      <Typography>You have selected rows {[selectedRows].join(', ')}.</Typography>
    </div>
  );
}

export function SelectableTableProvider(args: Parameters<typeof SelectableTableProviderComponent>[0]) {
  return (
    <SelectableTableProviderComponent {...args}>
      <ExampleTable />
    </SelectableTableProviderComponent>
  );
}

SelectableTableProvider.args = {
  tableLabel,
};

SelectableTableProvider.storyName = 'SelectableTableProvider'; // needed for single story hoisting for multi word component names
