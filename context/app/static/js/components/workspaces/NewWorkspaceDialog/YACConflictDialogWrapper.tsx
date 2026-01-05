import React, { useCallback } from 'react';
import { useEventCallback } from '@mui/material/utils';

import ConfirmStopYACWorkspaceDialog from 'js/components/workspaces/ConfirmStopYACWorkspaceDialog';
import { useLaunchWorkspace, useWorkspacesList } from 'js/components/workspaces/hooks';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import {
  MergedWorkspace,
  Workspace,
  WorkspaceResourceOptions,
  WorkspacesEventCategories,
} from 'js/components/workspaces/types';
import { WorkspacesEventContextProvider } from 'js/components/workspaces/contexts';

interface YACConflictDialogWrapperProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  conflictData: {
    runningWorkspace: MergedWorkspace;
    newWorkspace: Workspace;
    templatePath: string;
    resourceOptions: WorkspaceResourceOptions;
  } | null;
}

export default function YACConflictDialogWrapper({
  showDialog,
  setShowDialog,
  conflictData,
}: YACConflictDialogWrapperProps) {
  const { handleStopWorkspace } = useWorkspacesList();
  const { startAndOpenWorkspace } = useLaunchWorkspace();
  const { toastErrorStopWorkspace, toastSuccessStopWorkspace, toastErrorLaunchWorkspace } = useWorkspaceToasts();

  const handleClose = useCallback(() => {
    setShowDialog(false);
  }, [setShowDialog]);

  const handleConfirm = useEventCallback(async () => {
    if (!conflictData) {
      console.error('No conflict data found');
      return;
    }

    try {
      // Stop the running YAC workspace
      await handleStopWorkspace(conflictData.runningWorkspace.id);
      toastSuccessStopWorkspace(conflictData.runningWorkspace.name);

      // Launch the newly created workspace
      await startAndOpenWorkspace({
        workspace: conflictData.newWorkspace,
        jobTypeId: conflictData.newWorkspace.default_job_type ?? 'jupyter_lab',
        templatePath: conflictData.templatePath,
        resourceOptions: conflictData.resourceOptions,
      });

      handleClose();
    } catch (error) {
      console.error('Error stopping workspace or launching new one:', error);
      toastErrorStopWorkspace(conflictData.runningWorkspace.name);
      toastErrorLaunchWorkspace();
      handleClose();
    }
  });

  if (!showDialog || !conflictData) {
    return null;
  }

  return (
    <WorkspacesEventContextProvider
      currentEventCategory={WorkspacesEventCategories.WorkspaceDialog}
      currentWorkspaceItemId={conflictData.runningWorkspace.id}
      currentWorkspaceItemName={conflictData.runningWorkspace.name}
    >
      <ConfirmStopYACWorkspaceDialog
        handleClose={handleClose}
        handleConfirm={() => {
          void handleConfirm();
        }}
        runningYACWorkspace={conflictData.runningWorkspace}
      />
    </WorkspacesEventContextProvider>
  );
}
