import React from 'react';
import DialogModal from 'js/shared-styles/DialogModal';
import { Button, Stack } from '@mui/material';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useLaunchWorkspace, useRunningWorkspace, useWorkspacesList } from '../hooks';
import { useLaunchWorkspaceStore } from './store';

function LaunchWorkspaceDialog() {
  const runningWorkspace = useRunningWorkspace();
  const runningWorkspaceName = runningWorkspace?.name;
  const { handleStopWorkspace } = useWorkspacesList();
  const { startAndOpenWorkspace } = useLaunchWorkspace();

  const { isOpen, close, reset, workspace } = useLaunchWorkspaceStore();
  const workspaceName = workspace?.name;

  const { toastError } = useSnackbarActions();
  const handleLaunch = () => {
    if (!runningWorkspace) {
      console.error('No running workspace found');
      return;
    }
    if (!workspace) {
      console.error('No workspace to run found');
      return;
    }
    handleStopWorkspace(runningWorkspace.id)
      .then(() => {
        // Close to avoid flash of blank launch dialog
        close();
        startAndOpenWorkspace(workspace)
          .catch((e) => {
            toastError('Failed to launch workspace. Please try again.');
            reset();
            console.error(e);
          })
          .finally(() => {
            // reset the dialog even if the launch fails
            // since the running workspace has stopped
            reset();
          });
      })
      .catch((e) => {
        toastError('Failed to stop workspace. Please try again.');
        console.error(e);
      });
  };
  return (
    <DialogModal
      title={`Launch ${workspaceName}`}
      content={
        <Stack direction="column" gap={4}>
          <div>{runningWorkspaceName} is currently running. You can only run one workspace at a time.</div>
          <div>
            To launch this workspace, jobs in {runningWorkspaceName} will be stopped. Make sure to save all progress
            before launching this workspace.
          </div>
        </Stack>
      }
      isOpen={isOpen}
      handleClose={close}
      actions={
        <Stack direction="row" spacing={2} alignItems="end">
          <Button type="button" onClick={close}>
            Cancel
          </Button>
          <Button type="button" onClick={handleLaunch}>
            Launch
          </Button>
        </Stack>
      }
      withCloseButton
    />
  );
}

export default LaunchWorkspaceDialog;
