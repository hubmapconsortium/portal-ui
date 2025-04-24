import React from 'react';
import { WorkspaceItem, WorkspaceItemsTableProps } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import { isWorkspace } from 'js/components/workspaces/utils';
import LoadingRows from 'js/components/workspaces/Tables/WorkspaceItemsTable/components/LoadingRows';
import ResultRow from 'js/components/workspaces/Tables/WorkspaceItemsTable/components/ResultRow';

function TableResults<T extends WorkspaceItem>({
  isLoading,
  sortedItems,
  tableFields,
  numVisibleItems,
  selectedItemIds,
  toggleItem,
}: {
  sortedItems: T[];
  numVisibleItems: number;
} & Pick<WorkspaceItemsTableProps<T>, 'isLoading' | 'tableFields' | 'selectedItemIds' | 'toggleItem'>) {
  if (isLoading) {
    return <LoadingRows tableWidth={tableFields.length + 1} />;
  }

  return sortedItems
    .slice(0, numVisibleItems)
    .map((item) => (
      <ResultRow
        key={isWorkspace(item) ? item.id : item.shared_workspace_id.id}
        item={item}
        tableFields={tableFields}
        selectedItemIds={selectedItemIds}
        toggleItem={toggleItem}
      />
    ));
}

export default TableResults;
