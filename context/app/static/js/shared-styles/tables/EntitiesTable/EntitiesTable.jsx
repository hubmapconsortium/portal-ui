import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';

import { StyledDiv } from './style';

function EntitiesTable({ headerCells, tableRows }) {
  return (
    <StyledDiv>
      <Table stickyHeader>
        <TableHead>
          <TableRow>{headerCells}</TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </StyledDiv>
  );
}

export default EntitiesTable;
