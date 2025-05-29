import React from 'react';

import { isRunningWorkspace } from 'js/components/workspaces/utils';
import { WorkspaceTooltipButton } from 'js/components/workspaces/WorkspaceButton/WorkspaceButton';
import { TooltipButtonProps } from 'js/shared-styles/buttons/TooltipButton';
import { useWorkspacesList } from 'js/components/workspaces/hooks';
import { StopJobIcon } from 'js/shared-styles/icons';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { generateBoldCommaList } from 'js/helpers/functions';

type WorkspacesStopButtonProps = {
  workspaceIds: Set<string>;
} & TooltipButtonProps;

function WorkspacesStopButton({ workspaceIds, disabled, tooltip, ...rest }: WorkspacesStopButtonProps) {
  const { workspacesList } = useWorkspacesList();
  const { handleStopWorkspaces, isStoppingWorkspace } = useWorkspacesList();
  const { toastErrorStopWorkspace } = useWorkspaceToasts();

  const workspaces = workspacesList.filter((workspace) => workspaceIds.has(workspace.id.toString()));

  const noWorkspacesAreRunning = !workspacesList.some(isRunningWorkspace);
  const allSelectedWorkspacesAreRunning = workspaces.every(isRunningWorkspace);

  const updatedTooltip = allSelectedWorkspacesAreRunning ? tooltip : 'Only running workspaces can be stopped';
  const workspaceIdArr = Array.from(workspaceIds).map(Number);

  if (noWorkspacesAreRunning) {
    return null;
  }

  return (
    <WorkspaceTooltipButton
      onClick={() => {
        handleStopWorkspaces(workspaceIdArr).catch((err) => {
          toastErrorStopWorkspace(generateBoldCommaList(workspaces.map((ws) => ws.name)));
          console.error(err);
        });
      }}
      disabled={!allSelectedWorkspacesAreRunning || isStoppingWorkspace || disabled}
      tooltip={updatedTooltip}
      {...rest}
    >
      <StopJobIcon />
    </WorkspaceTooltipButton>
  );
}

export default WorkspacesStopButton;
