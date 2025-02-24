import React, { useEffect, useMemo, useState } from 'react';
import Stack from '@mui/material/Stack';
import { WorkspaceWithUserId } from 'js/components/workspaces/types';
import Description from 'js/shared-styles/sections/Description';
import WorkspaceItemsTable from 'js/components/workspaces/Tables/WorkspaceItemsTable/WorkspaceItemsTable';
import { SortField, TableFilter, TableField } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import { StyledNumSelectedHeader } from 'js/components/workspaces/Tables/WorkspaceItemsTable/style';

const tableFields: TableField[] = [
  {
    field: 'name',
    label: 'Name',
  },
  {
    field: 'status',
    label: 'Status',
  },
  {
    field: 'user_id.username',
    label: 'Created By',
  },
  {
    field: 'datetime_last_job_launch',
    label: 'Last Launched',
  },
];

const initialSortField: SortField = {
  direction: 'desc',
  field: 'datetime_last_job_launch',
};

export default function WorkspacesTable({
  workspacesList,
  selectedItems,
  isLoading,
  toggleItem,
}: {
  workspacesList: WorkspaceWithUserId[];
  selectedItems: Set<string>;
  isLoading: boolean;
  toggleItem: (item: string) => void;
}) {
  const { ownCount, sharedCount } = useMemo(() => {
    const own = workspacesList.filter((workspace) => !workspace.user_id).length;
    return { ownCount: own, sharedCount: workspacesList.length - own };
  }, [workspacesList]);

  const [showOwn, setShowOwn] = useState(true);
  const [showShared, setShowShared] = useState(true);

  useEffect(() => {
    setShowShared(sharedCount > 0);
  }, [sharedCount]);

  const filteredWorkspaces = useMemo(
    () =>
      [...workspacesList].filter((workspace) => {
        return (showOwn && !workspace.user_id) || (showShared && !!workspace.user_id);
      }),
    [workspacesList, showOwn, showShared],
  );

  const filters: TableFilter[] = useMemo(
    () => [
      {
        label: `Created by Me (${ownCount})`,
        setShow: setShowOwn,
        show: showOwn,
        disabled: !ownCount,
      },
      {
        label: `Created by Other (${sharedCount})`,
        setShow: setShowShared,
        show: showShared,
        disabled: !sharedCount,
      },
    ],
    [ownCount, sharedCount, showOwn, showShared],
  );

  return Object.keys(workspacesList).length === 0 ? (
    <Description>No workspaces created yet.</Description>
  ) : (
    <Stack>
      <StyledNumSelectedHeader numSelected={selectedItems.size} />
      <WorkspaceItemsTable
        items={filteredWorkspaces}
        isLoading={isLoading}
        itemType="workspace"
        filters={filters}
        tableFields={tableFields}
        initialSortField={initialSortField}
        selectedItemIds={selectedItems}
        toggleItem={toggleItem}
      />
    </Stack>
  );
}
