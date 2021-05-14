import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import DerivedEntitiesTableBody from 'js/components/Detail/DerivedEntitiesTableBody';
import { StyledTableContainer, HeaderCell } from 'js/shared-styles/Table';
import { getColumnNames } from './utils';

function DerivedEntitiesTable({ entities, entityType }) {
  const columns = getColumnNames(entityType);

  return (
    <Paper>
      <StyledTableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <HeaderCell key={column.id}>{column.label}</HeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <DerivedEntitiesTableBody entities={entities} entityType={entityType} />
        </Table>
      </StyledTableContainer>
    </Paper>
  );
}

export default DerivedEntitiesTable;
