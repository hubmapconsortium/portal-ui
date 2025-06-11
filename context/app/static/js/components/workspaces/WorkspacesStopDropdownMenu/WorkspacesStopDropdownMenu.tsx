import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

import { isRunningWorkspace } from 'js/components/workspaces/utils';
import { TooltipButtonProps } from 'js/shared-styles/buttons/TooltipButton';
import { useWorkspacesList } from 'js/components/workspaces/hooks';
import { StopJobIcon } from 'js/shared-styles/icons';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { generateBoldCommaList } from 'js/helpers/functions';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu/DropdownMenu';
import { StyledDropdownMenuButton } from 'js/shared-styles/dropdowns/DropdownMenuButton/DropdownMenuButton';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import SvgIcon from '@mui/material/SvgIcon';

function StopAllWorkspaces() {
  return (
    <MenuItem>
      <ListItemIcon>
        <StopJobIcon fontSize="1.25rem" color="primary" />
      </ListItemIcon>
      Stop All Workspaces
    </MenuItem>
  );
}

function StopSelectedWorkspaces({ workspaceIds }: { workspaceIds: Set<string> }) {
  const { workspacesList } = useWorkspacesList();
  const { handleStopWorkspaces, isStoppingWorkspace } = useWorkspacesList();
  const { toastErrorStopWorkspace, toastSuccessStopWorkspace } = useWorkspaceToasts();

  const workspaces = workspacesList.filter((workspace) => workspaceIds.has(workspace.id.toString()));

  const allSelectedWorkspacesAreRunning = workspaces.every(isRunningWorkspace);

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
      disabled={!allSelectedWorkspacesAreRunning || isStoppingWorkspace}
    >
      <ListItemIcon>
        <StopJobIcon fontSize="1.25rem" color="primary" />
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
      <StyledDropdownMenuButton menuID={menuID} variant="outlined" {...rest}>
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
