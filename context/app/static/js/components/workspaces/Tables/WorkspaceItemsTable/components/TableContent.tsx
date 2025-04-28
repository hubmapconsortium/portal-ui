import React from 'react';
import { WorkspaceItem, WorkspaceItemsTableProps } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import { useWorkspaceItemsTableContent } from 'js/components/workspaces/Tables/WorkspaceItemsTable/hooks';
import {
  StyledCheckboxHeaderCell,
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
} from 'js/components/workspaces/Tables/WorkspaceItemsTable/style';
import { CenteredAlert } from 'js/components/style';
import Checkbox from '@mui/material/Checkbox';
import HeaderCells from 'js/components/workspaces/Tables/WorkspaceItemsTable/components/HeaderCells';
import TableResults from 'js/components/workspaces/Tables/WorkspaceItemsTable/components/TableResults';
import SeeMoreRows from 'js/components/workspaces/Tables/WorkspaceItemsTable/components/SeeMoreRows';

function TableContent<T extends WorkspaceItem>(props: WorkspaceItemsTableProps<T>) {
  const { items, isLoading, itemType, tableFields, toggleItem, selectedItemIds, showSeeMoreOption, ...rest } = props;

  const {
    noFiltersSelected,
    sortedItems,
    sortField,
    setSortField,
    numVisibleItems,
    setNumVisibleItems,
    onToggleAllItems,
  } = useWorkspaceItemsTableContent(props);

  if (!isLoading && noFiltersSelected) {
    return (
      <StyledTableContainer sx={(theme) => ({ padding: theme.spacing(2) })}>
        <StyledTable>
          <CenteredAlert severity="info">No {itemType}s to display based on current filters.</CenteredAlert>
        </StyledTable>
      </StyledTableContainer>
    );
  }

  return (
    <>
      <StyledTableContainer sx={{ maxHeight: showSeeMoreOption ? 'inherit' : '425px' }}>
        <StyledTable>
          <StyledTableHead>
            {!!selectedItemIds && (
              <StyledCheckboxHeaderCell>
                <Checkbox checked={selectedItemIds?.size === items.length} onChange={onToggleAllItems} />
              </StyledCheckboxHeaderCell>
            )}
            <StyledTableCell width="0" />
            <HeaderCells tableFields={tableFields} sortField={sortField} setSortField={setSortField} {...rest} />
            <StyledTableCell />
          </StyledTableHead>
          <StyledTableBody>
            <TableResults
              isLoading={isLoading}
              sortedItems={sortedItems}
              tableFields={tableFields}
              numVisibleItems={numVisibleItems}
              selectedItemIds={selectedItemIds}
              toggleItem={toggleItem}
            />
          </StyledTableBody>
        </StyledTable>
      </StyledTableContainer>
      <SeeMoreRows
        showSeeMoreOption={showSeeMoreOption}
        numVisibleItems={numVisibleItems}
        setNumVisibleItems={setNumVisibleItems}
        totalItems={items.length}
      />
    </>
  );
}

export default TableContent;
