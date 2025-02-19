import React, { useEffect, useMemo, useState } from 'react';
import { WorkspaceWithUserInfo } from 'js/components/workspaces/types';
import Description from 'js/shared-styles/sections/Description';
import WorkspaceTable from 'js/components/workspaces/Tables/WorkspaceTable/WorkspaceTable';
import { SortField, TableFilter, TableField } from 'js/components/workspaces/Tables/WorkspaceTable/types';
import Stack from '@mui/material/Stack';
import { ChipWrapper } from 'js/components/workspaces/Tables/WorkspaceTable/style';

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
    field: 'datetime_created',
    label: 'Creation Date',
  },
];

const initialSortField: SortField = {
  direction: 'desc',
  field: 'datetime_created',
};

export default function WorkspacesTable({
  workspacesList,

  selectedItems,
  isLoading,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toggleItem,
}: {
  workspacesList: WorkspaceWithUserInfo[];
  selectedItems: Set<string>;
  isLoading: boolean;
  toggleItem: (item: string) => void;
}) {
  const { ownCount, sharedCount } = useMemo(() => {
    const own = workspacesList.filter((workspace) => !workspace.sharerInfo).length;
    return { ownCount: own, sharedCount: workspacesList.length - own };
  }, [workspacesList]);

  const [showOwn, setShowOwn] = useState(false);
  const [showShared, setShowShared] = useState(false);

  useEffect(() => {
    setShowOwn(ownCount > 0);
  }, [ownCount]);

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
      <ChipWrapper>{`${selectedItems.size} selected`}</ChipWrapper>
      <WorkspaceTable
        items={workspacesList}
        isLoading={isLoading}
        itemType="workspace"
        filters={filters}
        tableFields={tableFields}
        initialSortField={initialSortField}
        endButtons={[]}
      />
    </Stack>
    // workspacesList.map((workspace) => (
    //   /* TODO: Inbound links have fragments like "#workspace-123": Highlight? */
    //   <WorkspaceListItem
    //     workspace={workspace}
    //     key={workspace.id}
    //     toggleItem={(item: number) => toggleItem(item.toString())}
    //     selected={selectedItems.has(workspace.id.toString())}
    //     ToggleComponent={Checkbox}
    //     showLaunch
    //     showStop
    //   />
    // ))
  );
}
