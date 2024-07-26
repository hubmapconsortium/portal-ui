import React, { ElementType } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { useWorkspacesList } from 'js/components/workspaces/hooks';
import { isRunningWorkspace, findRunningWorkspace } from 'js/components/workspaces/utils';
import { useLaunchWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { Alert } from 'js/shared-styles/alerts';
import { MergedWorkspace } from '../types';

interface WorkspaceButtonProps {
  workspace: MergedWorkspace;
  handleStopWorkspace: (workspaceId: number) => Promise<void>;
  isStoppingWorkspace: boolean;
  disableLaunch?: boolean;
  disableStop?: boolean;
  button: ElementType<ButtonProps>;
}

function StopWorkspaceButton({
  workspace,
  handleStopWorkspace,
  button: ButtonComponent,
  isStoppingWorkspace,
}: Omit<WorkspaceButtonProps, 'disableLaunch' | 'disableStop'>) {
  const { toastError } = useSnackbarActions();
  const currentWorkspaceIsRunning = isRunningWorkspace(workspace);
  if (!currentWorkspaceIsRunning) {
    return null;
  }
  return (
    <ButtonComponent
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
    </ButtonComponent>
  );
}

function StopWorkspaceAlertButton(props: ButtonProps) {
  return <Button {...props}>Stop Jobs</Button>;
}

function StopWorkspaceAlert() {
  const { handleStopWorkspace, isStoppingWorkspace, workspacesList } = useWorkspacesList();
  const runningWorkspace = findRunningWorkspace(workspacesList);

  if (!runningWorkspace) {
    return null;
  }

  return (
    <Alert
      severity="warning"
      sx={{
        '.MuiAlert-message': {
          flexGrow: 1,
        },
        alignItems: 'center',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">
          {runningWorkspace.name} is running. Stop jobs before editing that workspace.
        </Typography>
        <StopWorkspaceButton
          handleStopWorkspace={handleStopWorkspace}
          isStoppingWorkspace={isStoppingWorkspace}
          workspace={runningWorkspace}
          button={StopWorkspaceAlertButton}
        />
      </Stack>
    </Alert>
  );
}

function WorkspaceLaunchStopButtons(props: WorkspaceButtonProps) {
  const { workspace, button: ButtonComponent, disableLaunch = false, disableStop = false } = props;
  const { open, setWorkspace } = useLaunchWorkspaceStore();
  if (workspace.status === 'deleting') {
    return (
      <ButtonComponent type="button" disabled size="small">
        Deleting...
      </ButtonComponent>
    );
  }
  return (
    <Stack direction="row" spacing={2}>
      {!disableStop && <StopWorkspaceButton {...props} />}
      {!disableLaunch && (
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={() => {
            setWorkspace(workspace);
            open();
          }}
        >
          Launch Workspace
        </Button>
      )}
    </Stack>
  );
}

export { StopWorkspaceAlert };
export default WorkspaceLaunchStopButtons;
