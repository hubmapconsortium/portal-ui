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
  CreateTemplateNotebooksTypes,
} from 'js/components/workspaces/types';
import { WorkspacesEventContextProvider } from 'js/components/workspaces/contexts';
import { useTemplateNotebooks } from './hooks';

interface YACConflictDialogWrapperProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  conflictData: {
    existingYACWorkspace: MergedWorkspace;
    // For new workspace creation - these fields are used to create the workspace after deletion
    deferredCreation?: CreateTemplateNotebooksTypes;
    // For launching existing workspace - these fields are provided
    newWorkspace?: Workspace;
    templatePath?: string;
    resourceOptions?: WorkspaceResourceOptions;
  } | null;
}

export default function YACConflictDialogWrapper({
  showDialog,
  setShowDialog,
  conflictData,
}: YACConflictDialogWrapperProps) {
  const { handleStopWorkspace, handleDeleteWorkspace } = useWorkspacesList();
  const { startAndOpenWorkspace } = useLaunchWorkspace();
  const { toastSuccessStopWorkspace, toastErrorLaunchWorkspace, toastErrorDeleteWorkspaces } = useWorkspaceToasts();
  const createTemplateNotebooks = useTemplateNotebooks();

  const handleClose = useCallback(() => {
    setShowDialog(false);
  }, [setShowDialog]);

  const handleConfirm = useEventCallback(async () => {
    if (!conflictData) {
      console.error('No conflict data found');
      return;
    }

    try {
      const { existingYACWorkspace } = conflictData;

      // Stop the workspace if it's running
      const isRunning = existingYACWorkspace.jobs.some((job) => job.status === 'running' || job.status === 'pending');
      if (isRunning) {
        await handleStopWorkspace(existingYACWorkspace.id);
        toastSuccessStopWorkspace(existingYACWorkspace.name);
      }

      // Delete the existing YAC workspace
      await handleDeleteWorkspace(existingYACWorkspace.id);

      // Now create and launch the new workspace
      if (conflictData.deferredCreation) {
        // This is a new workspace creation - create it now
        // Skip YAC check since we just deleted the conflicting workspace
        await createTemplateNotebooks({ ...conflictData.deferredCreation, skipYACCheck: true });
      } else if (conflictData.newWorkspace && conflictData.templatePath && conflictData.resourceOptions) {
        // This is launching an existing workspace
        await startAndOpenWorkspace({
          workspace: conflictData.newWorkspace,
          jobTypeId: conflictData.newWorkspace.default_job_type ?? 'jupyter_lab',
          templatePath: conflictData.templatePath,
          resourceOptions: conflictData.resourceOptions,
        });
      }

      handleClose();
    } catch (error) {
      console.error('Error deleting existing YAC workspace:', error);
      if (conflictData) {
        toastErrorDeleteWorkspaces(conflictData.existingYACWorkspace.name);
      }
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
      currentWorkspaceItemId={conflictData.existingYACWorkspace.id}
      currentWorkspaceItemName={conflictData.existingYACWorkspace.name}
    >
      <ConfirmStopYACWorkspaceDialog
        handleClose={handleClose}
        handleConfirm={() => {
          void handleConfirm();
        }}
        runningYACWorkspace={conflictData.existingYACWorkspace}
      />
    </WorkspacesEventContextProvider>
  );
}
