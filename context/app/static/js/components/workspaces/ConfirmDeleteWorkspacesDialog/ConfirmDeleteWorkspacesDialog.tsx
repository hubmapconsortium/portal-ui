import React from 'react';
import { useEventCallback } from '@mui/material/utils';

import { SelectedItems } from 'js/hooks/useSelectItems';
import { generateCommaList } from 'js/helpers/functions';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { useWorkspacesList } from 'js/components/workspaces/hooks';
import ConfirmationDialog from 'js/shared-styles/dialogs/ConfirmationDialog';

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

  const selectedWorkspaceNames = Array.from(selectedWorkspaceIds).map((id) => {
    const workspace = workspacesList.find((w) => w.id === Number(id));
    return workspace ? workspace.name : '';
  });

  const selectedWorkspaceNamesList = generateCommaList(selectedWorkspaceNames);

  const handleDeleteAndClose = useEventCallback(() => {
    const workspaceIds = [...selectedWorkspaceIds];

    Promise.all(workspaceIds.map((workspaceId) => handleDeleteWorkspace(Number(workspaceId))))
      .then(() => {
        toastSuccessDeleteWorkspaces(selectedWorkspaceNamesList);
        selectedWorkspaceIds.clear();
      })
      .catch((e) => {
        toastErrorDeleteWorkspaces(selectedWorkspaceNamesList);
        console.error(e);
      });

    handleClose();
  });

  return (
    <ConfirmationDialog
      title={`Delete Workspace ${selectedWorkspaceIds.size > 1 ? 's' : ''}`}
      handleClose={handleClose}
      handleConfirmAndClose={handleDeleteAndClose}
      buttonTitle="Delete"
    >
      You have selected to delete {selectedWorkspaceNamesList}. You cannot undo this action.
    </ConfirmationDialog>
  );
}
