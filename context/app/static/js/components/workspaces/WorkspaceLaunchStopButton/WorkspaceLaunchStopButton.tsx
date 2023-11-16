import React, { ElementType } from 'react';
import { ButtonProps } from '@mui/material/Button';

import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useLaunchWorkspace } from 'js/components/workspaces/hooks';
import { isRunningWorkspace } from 'js/components/workspaces/utils';

import { MergedWorkspace } from '../types';

interface WorkspaceButtonProps {
  workspace: MergedWorkspace;
  handleStopWorkspace: (workspaceId: number) => Promise<void>;
  isStoppingWorkspace: boolean;
  button: ElementType<ButtonProps>;
}

function WorkspaceLaunchStopButton({
  workspace,
  handleStopWorkspace,
  isStoppingWorkspace,
  button: Button,
}: WorkspaceButtonProps) {
  const { handleLaunchWorkspace } = useLaunchWorkspace(workspace);
  const { toastError } = useSnackbarActions();
  if (workspace.status === 'deleting') {
    return (
      <Button type="button" disabled size="small">
        Deleting...
      </Button>
    );
  }
  const currentWorkspaceIsRunning = isRunningWorkspace(workspace);
  if (currentWorkspaceIsRunning) {
    return (
      <Button
        type="button"
        disabled={isStoppingWorkspace}
        onClick={() => {
          handleStopWorkspace(workspace.id).catch((err) => {
            toastError(`Error stopping ${workspace.name}.`);
            console.error(err);
          });
        }}
      >
        Stop Jobs
      </Button>
    );
  }
  return (
    <Button
      type="button"
      onClick={() => {
        handleLaunchWorkspace().catch((err: Error) => {
          if (err.message.includes('already running')) {
            return;
          }
          toastError(`Error launching ${workspace.name}.`);
          console.error(err);
        });
      }}
    >
      Launch Workspace
    </Button>
  );
}

export default WorkspaceLaunchStopButton;
