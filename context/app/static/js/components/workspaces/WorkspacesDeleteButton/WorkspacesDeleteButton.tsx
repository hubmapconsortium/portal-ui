import React from 'react';
import DeleteRounded from '@mui/icons-material/DeleteRounded';

import { isRunningWorkspace } from 'js/components/workspaces/utils';
import { WorkspaceTooltipButton } from 'js/components/workspaces/WorkspaceButton/WorkspaceButton';
import { TooltipButtonProps } from 'js/shared-styles/buttons/TooltipButton';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useInvitationsList, useWorkspacesList } from 'js/components/workspaces/hooks';

type WorkspacesDeleteButtonProps = {
  workspaceIds: Set<string>;
  tooltip?: string;
  disabled?: boolean;
} & Omit<TooltipButtonProps, 'tooltip'>;

function WorkspacesDeleteButton({ workspaceIds, tooltip, disabled, ...rest }: WorkspacesDeleteButtonProps) {
  const { setDialogType } = useEditWorkspaceStore();
  const { sentInvitations } = useInvitationsList();
  const { workspacesList } = useWorkspacesList();

  const selectedWorkspaceHasPendingInvitations = sentInvitations.some((invitation) => {
    const originalWorkspaceId = invitation.original_workspace_id?.id?.toString();
    return !invitation.is_accepted && originalWorkspaceId && workspaceIds.has(originalWorkspaceId);
  });
  const workspaces = workspacesList.filter((workspace) => workspaceIds.has(workspace.id.toString()));
  const selectedWorkspaceIsRunning = workspaces.some(isRunningWorkspace);

  let updatedTooltip = tooltip;
  if (selectedWorkspaceHasPendingInvitations) {
    updatedTooltip = 'Workspaces with pending sent invitations cannot be deleted. Cancel invitations before deleting.';
  } else if (selectedWorkspaceIsRunning) {
    updatedTooltip = 'Workspace cannot be deleted while it is running. Stop jobs before deleting.';
  }

  return (
    <WorkspaceTooltipButton
      onClick={() => setDialogType('DELETE_WORKSPACE')}
      disabled={selectedWorkspaceIsRunning || selectedWorkspaceHasPendingInvitations || disabled}
      tooltip={updatedTooltip}
      {...rest}
    >
      <DeleteRounded />
    </WorkspaceTooltipButton>
  );
}

export default WorkspacesDeleteButton;
