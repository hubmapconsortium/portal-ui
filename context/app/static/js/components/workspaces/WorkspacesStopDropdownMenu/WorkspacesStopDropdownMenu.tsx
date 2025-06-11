import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import { isRunningWorkspace } from 'js/components/workspaces/utils';
import { TooltipButtonProps } from 'js/shared-styles/buttons/TooltipButton';
import { useRunningWorkspaces, useWorkspacesList } from 'js/components/workspaces/hooks';
import { ChecklistIcon, StopAllIcon, StopJobIcon } from 'js/shared-styles/icons';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { generateBoldCommaList } from 'js/helpers/functions';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu/DropdownMenu';
import { StyledDropdownMenuButton } from 'js/shared-styles/dropdowns/DropdownMenuButton/DropdownMenuButton';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import SvgIcon from '@mui/material/SvgIcon';

function StopAllWorkspaces() {
  const runningWorkspaces = useRunningWorkspaces();
  const { handleStopWorkspaces, isStoppingWorkspace } = useWorkspacesList();
  const { toastErrorStopWorkspace, toastSuccessStopWorkspace } = useWorkspaceToasts();

  const disabled = runningWorkspaces.length === 0 || isStoppingWorkspace;

  const workspaceIdArr = runningWorkspaces.map((workspace) => workspace.id);
  const workspaceNameList = generateBoldCommaList(runningWorkspaces.map((ws) => ws.name));

  return (
    <MenuItem
      onClick={() => {
        handleStopWorkspaces(workspaceIdArr)
          .then(() => {
            toastSuccessStopWorkspace(workspaceNameList);
          })
          .catch((err) => {
            toastErrorStopWorkspace(workspaceNameList);
            console.error(err);
          });
      }}
      disabled={disabled}
    >
      <ListItemIcon>
        <StopAllIcon fontSize="1.25rem" color="primary" />
      </ListItemIcon>
      Stop All Workspaces
    </MenuItem>
  );
}

function StopSelectedWorkspaces({ workspaceIds }: { workspaceIds: Set<string> }) {
  const { handleStopWorkspaces, isStoppingWorkspace, workspacesList } = useWorkspacesList();
  const { toastErrorStopWorkspace, toastSuccessStopWorkspace } = useWorkspaceToasts();

  const workspaces = workspacesList.filter((workspace) => workspaceIds.has(workspace.id.toString()));
  const disabled = workspaces.length === 0 || isStoppingWorkspace || !workspaces.every(isRunningWorkspace);

  const workspaceIdArr = Array.from(workspaceIds).map(Number);
  const workspaceNameList = generateBoldCommaList(workspaces.map((ws) => ws.name));

  return (
    <MenuItem
      onClick={() => {
        handleStopWorkspaces(workspaceIdArr)
          .then(() => {
            toastSuccessStopWorkspace(workspaceNameList);
          })
          .catch((err) => {
            toastErrorStopWorkspace(workspaceNameList);
            console.error(err);
          });
      }}
      disabled={disabled}
    >
      <ListItemIcon>
        <ChecklistIcon fontSize="1.25rem" color="primary" />
      </ListItemIcon>
      Stop Selected Workspaces
    </MenuItem>
  );
}

const menuID = 'workspaces-stop-menu';

type WorkspacesStopDropdownMenuProps = {
  workspaceIds: Set<string>;
} & TooltipButtonProps;

function WorkspacesStopDropdownMenu({ workspaceIds, disabled, tooltip, ...rest }: WorkspacesStopDropdownMenuProps) {
  const { workspacesList } = useWorkspacesList();
  const noWorkspacesAreRunning = !workspacesList.some(isRunningWorkspace);

  if (noWorkspacesAreRunning) {
    return null;
  }

  return (
    <>
      {/* Custom styling needed to match height of medium tooltip buttons */}
      <StyledDropdownMenuButton menuID={menuID} variant="outlined" sx={{ height: '2.65rem' }} {...rest}>
        <SvgIcon component={StopJobIcon} sx={{ mr: 1, fontSize: '1.25rem' }} />
        Stop Workspaces
      </StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        <StopAllWorkspaces />
        <StopSelectedWorkspaces workspaceIds={workspaceIds} />
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(WorkspacesStopDropdownMenu, false);
