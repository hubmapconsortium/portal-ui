import React from 'react';
import { useEventCallback } from '@mui/material/utils';

import { SelectedItems } from 'js/hooks/useSelectItems';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { useWorkspacesList } from 'js/components/workspaces/hooks';
import ConfirmationDialog from 'js/shared-styles/dialogs/ConfirmationDialog';
import { getSelectedWorkspaceNames } from 'js/components/workspaces/utils';
import { useWorkspacesEventContext } from 'js/components/workspaces/contexts';
import { trackEvent } from 'js/helpers/trackers';

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
  const { currentEventCategory } = useWorkspacesEventContext();

  const selectedWorkspaceNames = getSelectedWorkspaceNames({ selectedWorkspaceIds, workspacesList });

  const handleDeleteAndClose = useEventCallback(() => {
    const workspaceIds = [...selectedWorkspaceIds];

    trackEvent({
      category: currentEventCategory,
      action: 'Delete Workspace',
      label: workspaceIds,
    });

    Promise.all(workspaceIds.map((workspaceId) => handleDeleteWorkspace(Number(workspaceId))))
      .then(() => {
        toastSuccessDeleteWorkspaces(selectedWorkspaceNames);
        selectedWorkspaceIds.clear();
        // Redirect to the workspaces landing page if on a deleted workspace page
        if (window.location.href.includes(`/workspaces/${workspaceIds[0]}`)) {
          window.location.href = `/workspaces`;
        }
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
