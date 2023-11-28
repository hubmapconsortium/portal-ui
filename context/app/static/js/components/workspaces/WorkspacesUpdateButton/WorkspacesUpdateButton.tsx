import React from 'react';
import { styled } from '@mui/material/styles';

import { isRunningWorkspace } from 'js/components/workspaces/utils';
import { TooltipIconButton, TooltipButtonProps } from 'js/shared-styles/buttons/TooltipButton';
import { MergedWorkspace } from '../types';

const UpdateIconButton = styled(TooltipIconButton)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  color: theme.palette.primary.main,
  borderRadius: theme.spacing(0.5),
  border: `1px solid ${theme.palette.divider}`,
  height: '36.5px',
}));

type WorkspacesUpdateButtonProps = {
  workspace: MergedWorkspace;
} & Omit<TooltipButtonProps, 'tooltip'>;

function WorkspacesUpdateButton({ workspace, children, ...rest }: WorkspacesUpdateButtonProps) {
  const currentWorkspaceIsRunning = isRunningWorkspace(workspace);
  return (
    <UpdateIconButton
      {...rest}
      disabled={currentWorkspaceIsRunning}
      tooltip={
        currentWorkspaceIsRunning ? 'Workspace cannot be edited while it is running. Stop jobs before editing.' : null
      }
    >
      {children}
    </UpdateIconButton>
  );
}

export default WorkspacesUpdateButton;
