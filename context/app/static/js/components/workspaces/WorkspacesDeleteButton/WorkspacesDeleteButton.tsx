import React from 'react';
import DeleteRounded from '@mui/icons-material/DeleteRounded';

import { isRunningWorkspace } from 'js/components/workspaces/utils';
import { WorkspaceTooltipButton } from 'js/components/workspaces/WorkspaceButton/WorkspaceButton';
import { TooltipButtonProps } from 'js/shared-styles/buttons/TooltipButton';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useWorkspacesList } from 'js/components/workspaces/hooks';

type WorkspacesDeleteButtonProps = {
  workspaceIds: Set<string>;
  tooltip?: string;
  disabled?: boolean;
} & Omit<TooltipButtonProps, 'tooltip'>;

function WorkspacesDeleteButton({ workspaceIds, tooltip, disabled, ...rest }: WorkspacesDeleteButtonProps) {
  const { setDialogType } = useEditWorkspaceStore();
  const { workspacesList } = useWorkspacesList();
  const workspaces = workspacesList.filter((workspace) => workspaceIds.has(workspace.id.toString()));

  const selectedWorkspaceIsRunning = workspaces.some(isRunningWorkspace);
  const updatedTooltip = selectedWorkspaceIsRunning
    ? 'Workspace cannot be deleted while it is running. Stop jobs before deleting.'
    : tooltip;

  return (
    <WorkspaceTooltipButton
      onClick={() => setDialogType('DELETE_WORKSPACE')}
      disabled={selectedWorkspaceIsRunning || disabled}
      tooltip={updatedTooltip}
      {...rest}
    >
      <DeleteRounded />
    </WorkspaceTooltipButton>
  );
}

export default WorkspacesDeleteButton;
