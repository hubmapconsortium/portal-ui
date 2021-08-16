import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { TableCell } from '@material-ui/core';

const columns = [{ id: 'hubmap_id', label: 'HuBMAP ID' }];

function DatasetsTable({ datasets }) {
  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell key={column.id}>{column.label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {datasets.map(({ _source }) => (
          <TableRow key={_source.hubmap_id}>
            <TableCell>{_source.hubmap_id}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DatasetsTable;
