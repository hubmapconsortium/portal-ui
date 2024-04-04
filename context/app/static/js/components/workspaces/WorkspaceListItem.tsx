import React, { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import styled from '@mui/material/styles/styled';
import Button, { ButtonProps } from '@mui/material/Button';

import { PanelWrapper } from 'js/shared-styles/panels';
import WorkspaceDetails from 'js/components/workspaces/WorkspaceDetails';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import WorkspaceLaunchStopButtons from './WorkspaceLaunchStopButtons';
import { MergedWorkspace } from './types';
import { jobStatuses } from './statusCodes';
import { useWorkspacesList } from './hooks';

interface WorkspaceListItemProps {
  workspace: MergedWorkspace;
  toggleItem: (workspaceId: number) => void;
  ToggleComponent: typeof Checkbox | typeof Radio;
  selected: boolean;
}

const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: 300,
  borderRadius: theme.spacing(1),
}));

function LaunchStopButton(props: ButtonProps) {
  return <StyledButton {...props} variant="elevated" size="small" />;
}

function WorkspaceListItem({ workspace, toggleItem, selected, ToggleComponent }: WorkspaceListItemProps) {
  const { handleStopWorkspace, isStoppingWorkspace } = useWorkspacesList();
  const isRunning = workspace.jobs.some((j) => !jobStatuses[j.status].isDone);

  const tooltip = isRunning ?? 'Stop all jobs before selecting';

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
            <ToggleComponent
              aria-label={`Select ${workspace.name}.`}
              checked={selected}
              onChange={() => toggleItem(workspace.id)}
              disabled={isRunning}
            />
          </span>
        </SecondaryBackgroundTooltip>
        <WorkspaceDetails workspace={workspace} />
      </Stack>
      <WorkspaceLaunchStopButtons
        workspace={workspace}
        button={LaunchStopButton}
        handleStopWorkspace={handleStopWorkspace}
        isStoppingWorkspace={isStoppingWorkspace}
      />
    </PanelWrapper>
  );
}

export default WorkspaceListItem;
