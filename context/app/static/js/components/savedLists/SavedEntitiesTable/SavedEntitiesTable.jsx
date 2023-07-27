/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import NoItemsSaved from 'js/components/savedLists/NoItemsSaved';

import format from 'date-fns/format';

import { InternalLink } from 'js/shared-styles/Links';
import SelectableRowCell from 'js/shared-styles/tables/SelectableRowCell';
import { StyledTableContainer, HeaderCell } from 'js/shared-styles/tables';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import DeleteSavedEntitiesDialog from 'js/components/savedLists/DeleteSavedEntitiesDialog';
import { SpacedSectionButtonRow, BottomAlignedTypography } from 'js/shared-styles/sections/SectionButtonRow';
import AddItemsToListDialog from 'js/components/savedLists/AddItemsToListDialog';
import { withSelectableTableProvider } from 'js/shared-styles/tables/SelectableTableProvider';
import SelectableHeaderCell from 'js/shared-styles/tables/SelectableHeaderCell';
import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import DeselectAllRowsButton from 'js/shared-styles/tables/DeselectAllRowsButton';
import LoadingTableRows from 'js/shared-styles/tables/LoadingTableRows';
import useSavedEntityData from 'js/hooks/useSavedEntityData';
import { LeftMarginIconButton } from './style';

const defaultColumns = [
  { id: 'hubmap_id', label: 'HuBMAP ID' },
  { id: 'group_name', label: 'Group' },
  { id: 'entity_type', label: 'Entity Type' },
];

const source = ['hubmap_id', 'group_name', 'entity_type'];

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

  const { searchHits, isLoading } = useSavedEntityData(savedEntities, source);

  return (
    <>
      <SpacedSectionButtonRow
        leftText={
          <BottomAlignedTypography variant="subtitle1">
            {selectedRowsSize} {selectedRowsSize === 1 ? 'Item' : 'Items'} Selected
          </BottomAlignedTypography>
        }
        buttons={
          selectedRowsSize === 0 ? null : (
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
                <SelectableHeaderCell allTableRowKeys={searchHits.map((hit) => hit._id)} disabled={isLoading} />
                {columns.map((column) => (
                  <HeaderCell key={column.id}>{column.label}</HeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <LoadingTableRows numberOfRows={Object.keys(savedEntities).length} numberOfCols={5} />
              ) : (
                searchHits.map(
                  ({ _id, _source: { hubmap_id, group_name, entity_type } }) =>
                    _id in savedEntities && ( // on item deletion savedEntites will update before searchHits
                      <TableRow key={_id}>
                        <SelectableRowCell rowKey={_id} />
                        <TableCell>
                          <InternalLink href={`/browse/${entity_type.toLowerCase()}/${_id}`}>{hubmap_id}</InternalLink>
                        </TableCell>
                        <TableCell>{group_name}</TableCell>
                        <TableCell>{entity_type}</TableCell>
                        <TableCell>
                          {format(savedEntities[_id]?.dateSaved || savedEntities[_id]?.dateAddedToList, 'yyyy-MM-dd')}
                        </TableCell>
                      </TableRow>
                    ),
                )
              )}
            </TableBody>
          </Table>
          {(Object.keys(savedEntities).length === 0 || (searchHits.length === 0 && !isLoading)) && (
            <NoItemsSaved isSavedListPage={isSavedListPage} />
          )}
        </StyledTableContainer>
      </Paper>
    </>
  );
}

export default withSelectableTableProvider(SavedEntitiesTable, 'saved-entities');
