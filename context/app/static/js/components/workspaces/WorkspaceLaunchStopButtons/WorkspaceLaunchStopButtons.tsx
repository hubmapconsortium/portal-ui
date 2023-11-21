import React, { ElementType } from 'react';
import { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';

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

function StopWorkspaceButton({
  workspace,
  handleStopWorkspace,
  button: Button,
  isStoppingWorkspace,
}: WorkspaceButtonProps) {
  const { toastError } = useSnackbarActions();
  const currentWorkspaceIsRunning = isRunningWorkspace(workspace);
  if (!currentWorkspaceIsRunning) {
    return null;
  }
  return (
    <Button
      type="button"
      disabled={isStoppingWorkspace}
      variant="outlined"
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

function WorkspaceLaunchStopButtons(props: WorkspaceButtonProps) {
  const { workspace, button: Button } = props;
  const { handleLaunchWorkspace } = useLaunchWorkspace(workspace);
  const { toastError } = useSnackbarActions();
  if (workspace.status === 'deleting') {
    return (
      <Button type="button" disabled size="small">
        Deleting...
      </Button>
    );
  }
  return (
    <Stack direction="row" spacing={2}>
      <StopWorkspaceButton {...props} />
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
    </Stack>
  );
}

export default WorkspaceLaunchStopButtons;
