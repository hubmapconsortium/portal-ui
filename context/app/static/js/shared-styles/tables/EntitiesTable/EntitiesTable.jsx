import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';

import { StyledDiv } from './style';

function EntitiesTable({ headerRows, tableRows }) {
  return (
    <StyledDiv>
      <Table stickyHeader>
        <TableHead>
          <TableRow>{headerRows}</TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </StyledDiv>
  );
}

export default EntitiesTable;
