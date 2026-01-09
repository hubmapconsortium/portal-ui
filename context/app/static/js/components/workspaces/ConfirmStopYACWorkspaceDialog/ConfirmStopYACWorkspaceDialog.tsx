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

  const [pendingStopWorkspace, setPendingStopWorkspace] = React.useState(false);

  const handleStopAndConfirm = useEventCallback(() => {
    if (!runningYACWorkspace) {
      console.error('No running YAC workspace found');
      handleClose();
      return;
    }
    setPendingStopWorkspace(true);

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
      })
      .finally(() => {
        setPendingStopWorkspace(false);
      });
  });

  return (
    <ConfirmationDialog
      title="Delete Existing YAC Workspace"
      handleClose={handleClose}
      handleConfirmAndClose={handleStopAndConfirm}
      buttonTitle="Delete and Continue"
      buttonProps={{
        loading: pendingStopWorkspace,
      }}
    >
      You currently have a YAC workspace: <strong>{runningYACWorkspace?.name}</strong>. Only one YAC workspace can exist
      at a time. The existing workspace will be deleted to create the new one. Do you want to continue?
    </ConfirmationDialog>
  );
}
