import React from 'react';
import DeleteRounded from '@mui/icons-material/DeleteRounded';

import { isRunningWorkspace } from 'js/components/workspaces/utils';
import { WorkspaceTooltipButton } from 'js/components/workspaces/WorkspaceButton/WorkspaceButton';
import { TooltipButtonProps } from 'js/shared-styles/buttons/TooltipButton';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { useInvitationsList, useWorkspacesList } from 'js/components/workspaces/hooks';

const useDeleteWorkspaceTooltip = ({
  hasPendingInvitations,
  isRunning,
  tooltip,
}: {
  hasPendingInvitations: boolean;
  isRunning: boolean;
  tooltip?: string;
}) => {
  if (hasPendingInvitations) {
    return 'Workspaces with pending sent invitations cannot be deleted. Cancel invitations before deleting.';
  }
  if (isRunning) return 'Workspace cannot be deleted while it is running. Stop jobs before deleting.';

  return tooltip;
};

type WorkspacesDeleteButtonProps = {
  workspaceIds: Set<string>;
  tooltip?: string;
  disabled?: boolean;
} & Omit<TooltipButtonProps, 'tooltip'>;

function WorkspacesDeleteButton({ workspaceIds, tooltip, disabled, ...rest }: WorkspacesDeleteButtonProps) {
  const { setDialogType } = useEditWorkspaceStore();
  const { sentInvitations } = useInvitationsList();
  const { workspacesList } = useWorkspacesList();

  const hasPendingInvitations = sentInvitations.some((invitation) => {
    const originalWorkspaceId = invitation.original_workspace_id?.id?.toString();
    return !invitation.is_accepted && originalWorkspaceId && workspaceIds.has(originalWorkspaceId);
  });
  const workspaces = workspacesList.filter((workspace) => workspaceIds.has(workspace.id.toString()));
  const isRunning = workspaces.some(isRunningWorkspace);
  const updatedTooltip = useDeleteWorkspaceTooltip({ hasPendingInvitations, isRunning, tooltip });

  return (
    <WorkspaceTooltipButton
      onClick={() => {
        setDialogType('DELETE_WORKSPACE');
      }}
      disabled={isRunning || hasPendingInvitations || disabled}
      tooltip={updatedTooltip}
      {...rest}
    >
      <DeleteRounded />
    </WorkspaceTooltipButton>
  );
}

export default WorkspacesDeleteButton;
