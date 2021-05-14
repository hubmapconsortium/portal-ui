import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import DerivedEntitiesTableBody from 'js/components/Detail/DerivedEntitiesTableBody';
import { HeaderCell } from 'js/shared-styles/Table';
import { getColumnNames } from './utils';
import { StyledPaper } from './style';

function DerivedEntitiesTable({ entities, entityType }) {
  const columns = getColumnNames(entityType);

  return (
    <StyledPaper>
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
    </StyledPaper>
  );
}

export default DerivedEntitiesTable;
