import React from 'react';
import { useEventCallback } from '@mui/material/utils';

import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import ConfirmDeleteWorkspacesDialog from 'js/components/workspaces/ConfirmDeleteWorkspacesDialog';
import ShareWorkspacesDialog from 'js/components/workspaces/ShareWorkspacesDialog';
import ConfirmDeclineInvitationDialog from 'js/components/workspaces/ConfirmDeclineInvitationDialog/ConfirmDeclineInvitationDialog';
import ConfirmDeleteInvitationDialog from 'js/components/workspaces/ConfirmDeleteInvitationDialog/ConfirmDeleteInvitationDialog';

function WorkspacesListDialogs({ selectedWorkspaceIds }: { selectedWorkspaceIds: Set<string> }) {
  const { dialogType, setDialogType } = useEditWorkspaceStore();

  const handleClose = useEventCallback(() => {
    setDialogType(null);
  });

  if (dialogType === 'SHARE_WORKSPACE') {
    return <ShareWorkspacesDialog handleClose={handleClose} selectedWorkspaceIds={selectedWorkspaceIds} />;
  }

  if (dialogType === 'DECLINE_INVITATION') {
    return <ConfirmDeclineInvitationDialog />;
  }

  if (dialogType === 'DELETE_INVITATION') {
    return <ConfirmDeleteInvitationDialog />;
  }

  if (dialogType === 'DELETE_WORKSPACE') {
    return <ConfirmDeleteWorkspacesDialog handleClose={handleClose} selectedWorkspaceIds={selectedWorkspaceIds} />;
  }

  return null;
}

export default WorkspacesListDialogs;
