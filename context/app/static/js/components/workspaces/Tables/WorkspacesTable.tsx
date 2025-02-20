import React, { useEffect, useMemo, useState } from 'react';
import { WorkspaceInvitation, WorkspaceWithUserId } from 'js/components/workspaces/types';
import Description from 'js/shared-styles/sections/Description';
import WorkspaceTable from 'js/components/workspaces/Tables/WorkspaceTable/WorkspaceTable';
import { SortField, TableFilter, TableField } from 'js/components/workspaces/Tables/WorkspaceTable/types';
import Stack from '@mui/material/Stack';
import { ChipWrapper, StyledLaunchButton } from 'js/components/workspaces/Tables/WorkspaceTable/style';
import WorkspaceLaunchStopButtons from 'js/components/workspaces/WorkspaceLaunchStopButtons';
import { useWorkspacesList } from 'js/components/workspaces/hooks';
import { ButtonProps } from '@mui/material/Button';
import { Typography } from '@mui/material';

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

function LaunchStopButton(props: ButtonProps) {
  return <StyledLaunchButton {...props} />;
}

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

  const { handleStopWorkspace, isStoppingWorkspace } = useWorkspacesList();

  const endButtons = (item: WorkspaceWithUserId | WorkspaceInvitation) => {
    if ('original_workspace_id' in item) {
      return null;
    }

    return (
      <WorkspaceLaunchStopButtons
        workspace={item}
        button={LaunchStopButton}
        handleStopWorkspace={handleStopWorkspace}
        isStoppingWorkspace={isStoppingWorkspace}
        showLaunch
        showStop
      />
    );
  };

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
      <ChipWrapper>
        <Typography
          fontWeight="500"
          sx={(theme) => ({ color: selectedItems.size === 0 ? theme.palette.grey[500] : theme.palette.primary.main })}
        >
          {`${selectedItems.size} selected`}
        </Typography>
      </ChipWrapper>
      <WorkspaceTable
        items={filteredWorkspaces}
        isLoading={isLoading}
        itemType="workspace"
        filters={filters}
        tableFields={tableFields}
        initialSortField={initialSortField}
        endButtons={endButtons}
        selectedItemIds={selectedItems}
        toggleItem={toggleItem}
      />
    </Stack>
  );
}
