import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import styled from '@mui/material/styles/styled';

import { PanelWrapper } from 'js/shared-styles/panels';

import WorkspaceDetails from 'js/components/workspaces/WorkspaceDetails';
import { useSnackbarActions } from 'js/shared-styles/snackbars';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { useLaunchWorkspace, useWorkspacesList } from './hooks';
import { MergedWorkspace } from './types';
import { isRunningWorkspace } from './utils';
import { jobStatuses } from './statusCodes';

interface WorkspaceListItemProps {
  workspace: MergedWorkspace;
  toggleItem: (workspaceId: number) => void;
  selected: boolean;
}

type WorkspaceButtonProps = Pick<WorkspaceListItemProps, 'workspace'>;

const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: 300,
  borderRadius: theme.spacing(1),
})) as typeof Button;

function WorkspaceListItemButtons({ workspace }: WorkspaceButtonProps) {
  const { handleStopWorkspace, isStoppingWorkspace } = useWorkspacesList();
  const { handleLaunchWorkspace } = useLaunchWorkspace(workspace);
  const { toastError } = useSnackbarActions();
  if (workspace.status === 'deleting') {
    return (
      <StyledButton type="button" disabled variant="elevated" size="small">
        Deleting...
      </StyledButton>
    );
  }
  const currentWorkspaceIsRunning = isRunningWorkspace(workspace);
  if (currentWorkspaceIsRunning) {
    return (
      <StyledButton
        type="button"
        variant="elevated"
        size="small"
        disabled={isStoppingWorkspace}
        onClick={() => {
          handleStopWorkspace(workspace.id).catch((err) => {
            toastError(`Error stopping ${workspace.name}.`);
            console.error(err);
          });
        }}
      >
        Stop Jobs
      </StyledButton>
    );
  }
  return (
    <StyledButton
      type="button"
      variant="elevated"
      size="small"
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
    </StyledButton>
  );
}

function WorkspaceListItem({ workspace, toggleItem, selected }: WorkspaceListItemProps) {
  const { handleStartWorkspace } = useWorkspacesList();

  const isRunning = workspace.jobs.some((j) => !jobStatuses[j.status].isDone);

  const tooltip = isRunning ? 'Stop all jobs before deleting' : 'Delete workspace';

  // Deselect the workspace if the user starts it after selecting it for deletion
  useEffect(() => {
    if (isRunning && selected) {
      toggleItem(workspace.id);
    }
  }, [isRunning, selected, toggleItem, workspace.id]);

  return (
    <PanelWrapper key={workspace.id}>
      <Stack direction="row" spacing={2}>
        <SecondaryBackgroundTooltip title={tooltip}>
          <span>
            <Checkbox
              aria-label={`Select ${workspace.name} for deletion`}
              checked={selected}
              onChange={() => toggleItem(workspace.id)}
              disabled={isRunning}
            />
          </span>
        </SecondaryBackgroundTooltip>

        <WorkspaceDetails workspace={workspace} handleStartWorkspace={handleStartWorkspace} />
      </Stack>
      <WorkspaceListItemButtons workspace={workspace} />
    </PanelWrapper>
  );
}

export default WorkspaceListItem;
