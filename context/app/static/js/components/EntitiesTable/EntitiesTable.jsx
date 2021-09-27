import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import { HeaderCell } from 'js/shared-styles/Table';
import { StyledDiv } from './style';

function EntitiesTable({ columns, children }) {
  return (
    <StyledDiv>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <HeaderCell key={column.id}>{column.label}</HeaderCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>{children}</TableBody>
      </Table>
    </StyledDiv>
  );
}

export default EntitiesTable;
