import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';

import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import SavedEntitiesTableRow from 'js/components/savedLists/SavedEntitiesTableRow';
import DeleteSavedEntitiesDialog from 'js/components/savedLists/DeleteSavedEntitiesDialog';
import { SpacedSectionButtonRow, BottomAlignedTypography } from 'js/shared-styles/sections/SectionButtonRow';
import AddItemsToListDialog from 'js/components/savedLists/AddItemsToListDialog';
import { withSelectableTableProvider } from 'js/shared-styles/tables/SelectableTableProvider';
import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import DeselectAllRowsButton from 'js/shared-styles/tables/DeselectAllRowsButton';
import { LeftMarginIconButton } from './style';

const defaultColumns = [
  { id: 'hubmap_id', label: 'HuBMAP ID' },
  { id: 'group_name', label: 'Group' },
  { id: 'entity_type', label: 'Entity Type' },
];

function SavedEntitiesTable({ savedEntities, deleteCallback, setShouldDisplaySaveAlert, isSavedListPage }) {
  const { selectedRows, deselectHeaderAndRows } = useStore();
  const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false);

  const columns = isSavedListPage
    ? [...defaultColumns, { id: 'dateAddedToCollection', label: 'Date Added To Collection' }]
    : [...defaultColumns, { id: 'dateSaved', label: 'Date Saved' }];

  function deleteSelectedSavedEntities() {
    deleteCallback(selectedRows);
    deselectHeaderAndRows();
  }

  function onSaveCallback() {
    setShouldDisplaySaveAlert(true);
    deselectHeaderAndRows();
  }
  const selectedRowsSize = selectedRows.size;

  return (
    <>
      <SpacedSectionButtonRow
        leftText={
          <BottomAlignedTypography variant="subtitle1">
            {selectedRowsSize} {selectedRowsSize === 1 ? 'Item' : 'Items'} Selected
          </BottomAlignedTypography>
        }
        buttons={
          selectedRowsSize > 0 && (
            <div>
              <DeselectAllRowsButton />
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
                <AddItemsToListDialog itemsToAddUUIDS={selectedRows} onSaveCallback={onSaveCallback} />
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
                <SelectableHeaderCell allTableRowKeys={Object.keys(savedEntities)} />
                {columns.map((column) => (
                  <HeaderCell key={column.id}>{column.label}</HeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(savedEntities).map(([key, value], i) => (
                <SavedEntitiesTableRow key={key} uuid={key} rowData={value} index={i} />
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </Paper>
    </>
  );
}

export default withSelectableTableProvider(SavedEntitiesTable, 'saved-entities');
