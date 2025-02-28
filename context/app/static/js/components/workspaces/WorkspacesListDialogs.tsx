import React from 'react';
import { useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import ConfirmDeleteWorkspacesDialog from 'js/components/workspaces/ConfirmDeleteWorkspacesDialog';
import ShareWorkspacesDialog from 'js/components/workspaces/ShareWorkspacesDialog';

function WorkspacesListDialogs({ selectedWorkspaceIds }: { selectedWorkspaceIds: Set<string> }) {
  const { dialogType, setDialogType } = useEditWorkspaceStore();

  if (dialogType === 'DELETE_WORKSPACE') {
    return (
      <ConfirmDeleteWorkspacesDialog
        handleClose={() => setDialogType(null)}
        selectedWorkspaceIds={selectedWorkspaceIds}
      />
    );
  }

  if (dialogType === 'SHARE_WORKSPACE') {
    return (
      <ShareWorkspacesDialog handleClose={() => setDialogType(null)} selectedWorkspaceIds={selectedWorkspaceIds} />
    );
  }

  if (dialogType === 'DECLINE_INVITATION') {
    return (
      <ShareWorkspacesDialog handleClose={() => setDialogType(null)} selectedWorkspaceIds={selectedWorkspaceIds} />
    );
  }

  return null;
}

export default WorkspacesListDialogs;
