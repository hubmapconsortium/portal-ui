import React, { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import styled from '@mui/material/styles/styled';
import Button, { ButtonProps } from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';

import { PanelWrapper } from 'js/shared-styles/panels';
import WorkspaceDetails from 'js/components/workspaces/WorkspaceDetails';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { isWorkspaceAtDatasetLimit } from 'js/helpers/functions';

import WorkspaceLaunchStopButtons from './WorkspaceLaunchStopButtons';
import { MergedWorkspace } from './types';
import { jobStatuses } from './statusCodes';
import { useWorkspacesList } from './hooks';

interface WorkspaceListItemProps {
  workspace: MergedWorkspace;
  toggleItem: (workspaceId: number) => void;
  ToggleComponent: typeof Checkbox | typeof Radio;
  selected: boolean;
  disableStop?: boolean;
  disableLaunch?: boolean;
  checkMaxDatasets?: boolean;
}

const StyledButton = styled(Button)(({ theme }) => ({
  fontWeight: 300,
  borderRadius: theme.spacing(1),
}));

function LaunchStopButton(props: ButtonProps) {
  return <StyledButton {...props} variant="elevated" size="small" />;
}

function WorkspaceListItem({
  workspace,
  toggleItem,
  selected,
  ToggleComponent,
  disableLaunch = false,
  disableStop = false,
  checkMaxDatasets = false,
}: WorkspaceListItemProps) {
  const { handleStopWorkspace, isStoppingWorkspace } = useWorkspacesList();
  const isRunning = workspace.jobs.some((j) => !jobStatuses[j.status].isDone);
  const hasMaxDatasets = isWorkspaceAtDatasetLimit(workspace);

  let tooltip;
  if (checkMaxDatasets && hasMaxDatasets) {
    tooltip = 'This workspace has reached the maximum number of datasets allowed. You cannot add any more datasets.';
  } else if (isRunning) {
    tooltip = 'Stop all jobs before selecting.';
  }

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
              disabled={isRunning || hasMaxDatasets}
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
        disableLaunch={disableLaunch}
        disableStop={disableStop}
        checkMaxDatasets={checkMaxDatasets}
      />
    </PanelWrapper>
  );
}

export default WorkspaceListItem;
