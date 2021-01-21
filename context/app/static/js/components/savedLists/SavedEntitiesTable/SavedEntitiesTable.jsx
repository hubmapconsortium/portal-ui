import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/Table';
import SavedEntitiesTableRow from 'js/components/savedLists/SavedEntitiesTableRow';

const columns = [
  { id: 'display_doi', label: 'HuBMAP ID' },
  { id: 'entity_type', label: 'Entity Type' },
  { id: 'group_name', label: 'Group' },
  { id: 'dateSaved', label: 'Date Saved' },
];

function SavedEntitiesTable({ savedEntities }) {
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
          <TableBody>
            {Object.entries(savedEntities).map(([key, value]) => (
              <SavedEntitiesTableRow uuid={key} dateSaved={value.dateSaved} />
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Paper>
  );
}

export default SavedEntitiesTable;
