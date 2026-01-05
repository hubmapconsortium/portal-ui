import React from 'react';
import { useEventCallback } from '@mui/material/utils';

import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { useWorkspacesList } from 'js/components/workspaces/hooks';
import ConfirmationDialog from 'js/shared-styles/dialogs/ConfirmationDialog';
import { useWorkspacesEventContext } from 'js/components/workspaces/contexts';
import { trackEvent } from 'js/helpers/trackers';
import { MergedWorkspace } from 'js/components/workspaces/types';

interface ConfirmStopYACWorkspaceDialogProps {
  handleClose: () => void;
  handleConfirm: () => void;
  runningYACWorkspace: MergedWorkspace | null;
}

export default function ConfirmStopYACWorkspaceDialog({
  handleClose,
  handleConfirm,
  runningYACWorkspace,
}: ConfirmStopYACWorkspaceDialogProps) {
  const { toastErrorStopWorkspace, toastSuccessStopWorkspace } = useWorkspaceToasts();
  const { handleStopWorkspace } = useWorkspacesList();
  const { currentEventCategory } = useWorkspacesEventContext();

  const handleStopAndConfirm = useEventCallback(() => {
    if (!runningYACWorkspace) {
      console.error('No running YAC workspace found');
      handleClose();
      return;
    }

    trackEvent({
      category: currentEventCategory,
      action: 'Stop YAC Workspace',
      label: runningYACWorkspace.id.toString(),
    });

    handleStopWorkspace(runningYACWorkspace.id)
      .then(() => {
        toastSuccessStopWorkspace(runningYACWorkspace.name);
        handleConfirm();
      })
      .catch((e) => {
        toastErrorStopWorkspace(runningYACWorkspace.name);
        console.error(e);
        handleClose();
      });
  });

  return (
    <ConfirmationDialog
      title="Stop Running YAC Workspace"
      handleClose={handleClose}
      handleConfirmAndClose={handleStopAndConfirm}
      buttonTitle="Stop and Continue"
    >
      You currently have a YAC workspace running: <strong>{runningYACWorkspace?.name}</strong>. Only one YAC workspace
      can run at a time. Do you want to stop the existing workspace and launch the new one?
    </ConfirmationDialog>
  );
}
