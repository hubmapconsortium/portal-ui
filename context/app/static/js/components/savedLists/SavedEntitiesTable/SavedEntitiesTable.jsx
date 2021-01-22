import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/Table';
import SavedEntitiesTableRow from 'js/components/savedLists/SavedEntitiesTableRow';

const columns = [
  { id: 'display_doi', label: 'HuBMAP ID' },
  { id: 'entity_type', label: 'Entity Type' },
  { id: 'group_name', label: 'Group' },
  { id: 'dateSaved', label: 'Date Saved' },
];

function SavedEntitiesTable({ savedEntities }) {
  const [selectedRows, setSelectedRows] = useState(new Set([]));
  const [headerRowIsSelected, setHeaderRowIsSelected] = useState(false);

  function addToSelectedRows(rowUuid) {
    const selectedRowsCopy = new Set(selectedRows);
    selectedRowsCopy.add(rowUuid);
    setSelectedRows(selectedRowsCopy);
  }

  function removeFromSelectedRows(rowUuid) {
    const selectedRowsCopy = new Set(selectedRows);
    selectedRowsCopy.delete(rowUuid);
    setSelectedRows(selectedRowsCopy);
  }

  function selectAllRows() {
    setSelectedRows(new Set(Object.keys(savedEntities)));
    setHeaderRowIsSelected(true);
  }

  return (
    <>
      <Typography variant="subtitle1">
        {selectedRows.size} {selectedRows.size === 1 ? 'Item' : 'Items'} Selected
      </Typography>
      <Paper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow onClick={() => selectAllRows()}>
                <HeaderCell padding="checkbox">
                  <Checkbox
                    checked={headerRowIsSelected}
                    inputProps={{ 'aria-labelledby': `saved-entities-header-row-checkbox` }}
                  />
                </HeaderCell>
                {columns.map((column) => (
                  <HeaderCell key={column.id}>{column.label}</HeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(savedEntities).map(([key, value], i) => (
                <SavedEntitiesTableRow
                  uuid={key}
                  dateSaved={value.dateSaved}
                  index={i}
                  isSelected={selectedRows.has(key)}
                  addToSelectedRows={addToSelectedRows}
                  removeFromSelectedRows={removeFromSelectedRows}
                />
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </>
  );
}

export default SavedEntitiesTable;
