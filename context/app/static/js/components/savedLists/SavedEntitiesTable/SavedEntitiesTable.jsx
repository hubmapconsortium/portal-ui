import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/Table';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import SavedEntitiesTableRow from 'js/components/savedLists/SavedEntitiesTableRow';
import DeleteSavedEntitiesDialog from 'js/components/savedLists/DeleteSavedEntitiesDialog';
import SaveToListDialog from 'js/components/savedLists/SaveToListDialog';
import useStateSet from 'js/hooks/useStateSet';
import { StyledButtonRow, BottomAlignedTypography } from 'js/shared-styles/sections/RightAlignedButtonRow';
import { LeftMarginButton, LeftMarginIconButton } from './style';

const defaultColumns = [
  { id: 'hubmap_id', label: 'HuBMAP ID' },
  { id: 'group_name', label: 'Group' },
  { id: 'entity_type', label: 'Entity Type' },
];

function SavedEntitiesTable({ savedEntities, deleteCallback, setShouldDisplaySaveAlert, isSavedListPage }) {
  const [selectedRows, addToSelectedRows, removeFromSelectedRows, setSelectedRows] = useStateSet([]);
  const [headerRowIsSelected, setHeaderRowIsSelected] = useState(false);
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);
  const [addToDialogIsOpen, setAddToDialogIsOpen] = useState(false);

  const columns = isSavedListPage
    ? [...defaultColumns, { id: 'dateAddedToCollection', label: 'Date Added To Collection' }]
    : [...defaultColumns, { id: 'dateSaved', label: 'Date Saved' }];

  function selectAllRows() {
    setSelectedRows(new Set(Object.keys(savedEntities)));
    setHeaderRowIsSelected(true);
  }

  function deselectAllRows() {
    setSelectedRows(new Set([]));
    setHeaderRowIsSelected(false);
  }

  function deleteSelectedSavedEntities() {
    deleteCallback(selectedRows);
    deselectAllRows();
  }

  function onSaveCallback() {
    setShouldDisplaySaveAlert(true);
    deselectAllRows();
  }
  const selectedRowsSize = selectedRows.size;

  return (
    <>
      <StyledButtonRow
        leftText={
          <BottomAlignedTypography variant="subtitle1">
            {selectedRowsSize} {selectedRowsSize === 1 ? 'Item' : 'Items'} Selected
          </BottomAlignedTypography>
        }
        buttons={
          selectedRowsSize > 0 && (
            <div>
              <Button color="primary" onClick={deselectAllRows}>
                Deselect All ({selectedRowsSize})
              </Button>
              <SecondaryBackgroundTooltip title="Delete Items">
                <LeftMarginIconButton onClick={() => setDeleteDialogIsOpen(true)}>
                  <DeleteRoundedIcon color="primary" />
                </LeftMarginIconButton>
              </SecondaryBackgroundTooltip>
              <DeleteSavedEntitiesDialog
                dialogIsOpen={deleteDialogIsOpen}
                setDialogIsOpen={setDeleteDialogIsOpen}
                deleteSelectedSavedEntities={deleteSelectedSavedEntities}
              />
              {!isSavedListPage && (
                <>
                  <LeftMarginButton color="primary" onClick={() => setAddToDialogIsOpen(true)} variant="contained">
                    Add To
                  </LeftMarginButton>
                  <SaveToListDialog
                    title="Add Items To"
                    dialogIsOpen={addToDialogIsOpen}
                    setDialogIsOpen={setAddToDialogIsOpen}
                    entitiesToAdd={selectedRows}
                    onSaveCallback={onSaveCallback}
                  />
                </>
              )}
            </div>
          )
        }
      />
      <Paper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <HeaderCell padding="checkbox" onClick={headerRowIsSelected ? deselectAllRows : selectAllRows}>
                  <Checkbox
                    checked={headerRowIsSelected}
                    inputProps={{ 'aria-labelledby': 'saved-entities-header-row-checkbox' }}
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
                  key={key}
                  uuid={key}
                  rowData={value}
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
