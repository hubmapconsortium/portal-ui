import React, { ElementType } from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useWorkspacesList } from 'js/components/workspaces/hooks';
import { isRunningWorkspace, findRunningWorkspace } from 'js/components/workspaces/utils';
import { Alert } from 'js/shared-styles/alerts';
import { isWorkspaceAtDatasetLimit } from 'js/helpers/functions';
import { MergedWorkspace } from 'js/components/workspaces/types';
import { useLaunchWorkspaceDialog } from 'js/components/workspaces/LaunchWorkspaceDialog/hooks';
import { useWorkspaceToasts } from 'js/components/workspaces/toastHooks';
import { StyledLaunchButton, StyledSvgIcon } from 'js/components/workspaces/style';
import { trackEvent } from 'js/helpers/trackers';
import { StartJobIcon, StopJobIcon } from 'js/shared-styles/icons';
import { EventInfo } from 'js/components/types';

interface WorkspaceButtonProps {
  workspace: MergedWorkspace;
  handleStopWorkspace: (workspaceId: number) => Promise<void>;
  button: ElementType<ButtonProps>;
  isStoppingWorkspace: boolean;
  showLaunch?: boolean;
  showStop?: boolean;
  showIcons?: boolean;
  trackingInfo?: EventInfo;
}

function StopWorkspaceButton({
  workspace,
  handleStopWorkspace,
  button: ButtonComponent,
  isStoppingWorkspace,
  showIcons,
}: Omit<WorkspaceButtonProps, 'showLaunch' | 'showStop'>) {
  const { toastErrorStopWorkspace } = useWorkspaceToasts();
  const currentWorkspaceIsRunning = isRunningWorkspace(workspace);

  if (!currentWorkspaceIsRunning) {
    return null;
  }

  return (
    <ButtonComponent
      type="button"
      disabled={isStoppingWorkspace}
      variant="contained"
      sx={{ border: 'none' }}
      onClick={() => {
        handleStopWorkspace(workspace.id).catch((err) => {
          toastErrorStopWorkspace(workspace.name);
          console.error(err);
        });
      }}
      startIcon={showIcons ? <StyledSvgIcon as={StopJobIcon} /> : undefined}
    >
      Stop
    </ButtonComponent>
  );
}

function LaunchWorkspaceButton({
  workspace,
  trackingInfo,
  button: ButtonComponent,
  showIcons,
}: Omit<WorkspaceButtonProps, 'showLaunch' | 'showStop'>) {
  const { launchOrOpenDialog } = useLaunchWorkspaceDialog();

  return (
    <ButtonComponent
      onClick={() => {
        if (trackingInfo) {
          trackEvent({
            ...trackingInfo,
            action: 'Launch Open Workspace Dialog',
            label: workspace.name,
          });
        }
        launchOrOpenDialog(workspace);
      }}
      startIcon={showIcons ? <StyledSvgIcon as={StartJobIcon} /> : undefined}
    >
      Launch
    </ButtonComponent>
  );
}

function WorkspaceLaunchStopButtons(props: WorkspaceButtonProps) {
  const { workspace, button: ButtonComponent, showLaunch = false, showStop = false } = props;

  if (workspace.status === 'deleting') {
    return (
      <ButtonComponent type="button" disabled size="small">
        Deleting...
      </ButtonComponent>
    );
  }

  return (
    <Stack direction="row" spacing={1}>
      {showStop && <StopWorkspaceButton {...props} />}
      {showLaunch && <LaunchWorkspaceButton {...props} />}
    </Stack>
  );
}

function StopWorkspaceAlertButton(props: ButtonProps) {
  return <Button {...props}>Stop Jobs</Button>;
}

function StopWorkspaceAlert() {
  const { handleStopWorkspace, isStoppingWorkspace, workspacesList } = useWorkspacesList();

  const runningWorkspace = findRunningWorkspace(workspacesList);
  const runningWorkspaceAtMaxDatasets = runningWorkspace && isWorkspaceAtDatasetLimit(runningWorkspace);

  if (!runningWorkspace || runningWorkspaceAtMaxDatasets) {
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

function LaunchStopButton(props: ButtonProps) {
  return <StyledLaunchButton {...props} />;
}

export { StopWorkspaceAlert, LaunchStopButton };
export default WorkspaceLaunchStopButtons;
