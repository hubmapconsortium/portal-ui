import React from 'react';
import { useEventCallback } from '@mui/material/utils';

import { SelectedItems } from 'js/hooks/useSelectItems';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { useWorkspacesList } from 'js/components/workspaces/hooks';
import ConfirmationDialog from 'js/shared-styles/dialogs/ConfirmationDialog';
import { getSelectedWorkspaceNames } from 'js/components/workspaces/utils';

interface ConfirmDeleteWorkspacesDialogProps {
  handleClose: () => void;
  selectedWorkspaceIds: SelectedItems;
}
export default function ConfirmDeleteWorkspacesDialog({
  handleClose,
  selectedWorkspaceIds,
}: ConfirmDeleteWorkspacesDialogProps) {
  const { toastErrorDeleteWorkspaces, toastSuccessDeleteWorkspaces } = useWorkspaceToasts();
  const { workspacesList, handleDeleteWorkspace } = useWorkspacesList();

  const selectedWorkspaceNames = getSelectedWorkspaceNames({ selectedWorkspaceIds, workspacesList });

  const handleDeleteAndClose = useEventCallback(() => {
    const workspaceIds = [...selectedWorkspaceIds];

    Promise.all(workspaceIds.map((workspaceId) => handleDeleteWorkspace(Number(workspaceId))))
      .then(() => {
        toastSuccessDeleteWorkspaces(selectedWorkspaceNames);
        selectedWorkspaceIds.clear();
      })
      .catch((e) => {
        toastErrorDeleteWorkspaces(selectedWorkspaceNames);
        console.error(e);
      });

    handleClose();
  });

  return (
    <ConfirmationDialog
      title={`Delete Workspace${selectedWorkspaceIds.size > 1 ? 's' : ''}`}
      handleClose={handleClose}
      handleConfirmAndClose={handleDeleteAndClose}
      buttonTitle="Delete"
    >
      You have selected to delete {selectedWorkspaceNames}. You cannot undo this action.
    </ConfirmationDialog>
  );
}
