import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import SvgIcon from '@mui/material/SvgIcon';

import { useRunningWorkspaces, useWorkspacesList } from 'js/components/workspaces/hooks';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { isRunningWorkspace } from 'js/components/workspaces/utils';
import { generateBoldCommaList } from 'js/helpers/functions';
import { StopAllIcon, StopJobIcon, ChecklistIcon } from 'js/shared-styles/icons';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu/DropdownMenu';
import DropdownMenuButton from 'js/shared-styles/dropdowns/DropdownMenuButton/DropdownMenuButton';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';

interface StopActionProps {
  workspaces: { id: number; name: string }[];
  label: string;
  Icon: typeof SvgIcon;
  disabled: boolean;
}

function StopMenuItem({ workspaces, label, Icon, disabled }: StopActionProps) {
  const { handleStopWorkspaces } = useWorkspacesList();
  const { toastErrorStopWorkspace, toastSuccessStopWorkspace } = useWorkspaceToasts();

  const workspaceIds = workspaces.map((ws) => ws.id);
  const workspaceNames = generateBoldCommaList(workspaces.map((ws) => ws.name));

  const handleStop = () => {
    handleStopWorkspaces(workspaceIds)
      .then(() => {
        toastSuccessStopWorkspace(workspaceNames);
      })
      .catch((err) => {
        toastErrorStopWorkspace(workspaceNames);
        console.error(err);
      });
  };

  return (
    <MenuItem onClick={handleStop} disabled={disabled}>
      <ListItemIcon>
        <Icon fontSize="1.25rem" color="primary" />
      </ListItemIcon>
      {label}
    </MenuItem>
  );
}

function StopAllWorkspaces() {
  const runningWorkspaces = useRunningWorkspaces();
  const { isStoppingWorkspace } = useWorkspacesList();

  return (
    <StopMenuItem
      workspaces={runningWorkspaces}
      label="Stop All Workspaces"
      Icon={StopAllIcon}
      disabled={runningWorkspaces.length === 0 || isStoppingWorkspace}
    />
  );
}

function StopSelectedWorkspaces({ workspaceIds }: { workspaceIds: Set<string> }) {
  const { workspacesList, isStoppingWorkspace } = useWorkspacesList();

  const selectedWorkspaces = workspacesList.filter((ws) => workspaceIds.has(ws.id.toString()));
  const areAllRunning = selectedWorkspaces.every(isRunningWorkspace);

  return (
    <StopMenuItem
      workspaces={selectedWorkspaces}
      label="Stop Selected Workspaces"
      Icon={ChecklistIcon}
      disabled={selectedWorkspaces.length === 0 || isStoppingWorkspace || !areAllRunning}
    />
  );
}

const menuID = 'workspaces-stop-menu';

interface WorkspacesStopDropdownMenuProps {
  workspaceIds: Set<string>;
}

function WorkspacesStopDropdownMenu({ workspaceIds }: WorkspacesStopDropdownMenuProps) {
  return (
    <>
      <DropdownMenuButton menuID={menuID} variant="outlined">
        <SvgIcon component={StopJobIcon} sx={{ mr: 1, fontSize: '1.25rem' }} />
        Stop Workspaces
      </DropdownMenuButton>
      <DropdownMenu id={menuID}>
        <StopAllWorkspaces />
        <StopSelectedWorkspaces workspaceIds={workspaceIds} />
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(WorkspacesStopDropdownMenu, false);
