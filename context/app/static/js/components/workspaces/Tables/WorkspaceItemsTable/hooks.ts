import { useEffect, useMemo, useState } from 'react';
import useEventCallback from '@mui/material/utils/useEventCallback';
import {
  SortField,
  WorkspaceItem,
  WorkspaceItemsTableProps,
} from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import { getFieldValue, isWorkspace } from 'js/components/workspaces/utils';

function useWorkspaceItemsTable<T extends WorkspaceItem>({
  items,
  initialSortField,
  showSeeMoreOption,
  filters,
  toggleAllItems,
}: WorkspaceItemsTableProps<T>) {
  const [sortField, setSortField] = useState<SortField>(initialSortField);
  const [numVisibleItems, setNumVisibleItems] = useState(3);

  useEffect(() => {
    setNumVisibleItems(showSeeMoreOption ? 3 : items.length);
  }, [items, showSeeMoreOption]);

  const noFiltersSelected = useMemo(() => filters.every(({ show }) => !show), [filters]);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const aValue = getFieldValue({ item: a, field: sortField.field });
        const bValue = getFieldValue({ item: b, field: sortField.field });

        if (aValue < bValue) return sortField.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortField.direction === 'asc' ? 1 : -1;
        return 0;
      }),
    [items, sortField],
  );

  const onToggleAllItems = useEventCallback(() => {
    const itemIds = items.map((item) =>
      isWorkspace(item) ? item.id.toString() : item.original_workspace_id.id.toString(),
    );
    toggleAllItems?.(itemIds);
  });

  return {
    numVisibleItems,
    setNumVisibleItems,
    noFiltersSelected,
    sortedItems,
    sortField,
    setSortField,
    onToggleAllItems,
  };
}

export default useWorkspaceItemsTable;
