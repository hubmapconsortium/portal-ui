import React from 'react';
import { styled } from '@mui/material/styles';

import { isRunningWorkspace } from 'js/components/workspaces/utils';
import { TooltipIconButton, TooltipButtonProps } from 'js/shared-styles/buttons/TooltipButton';
import { useEditWorkspaceStore, DialogType } from 'js/stores/useWorkspaceModalStore';
import { trackEvent } from 'js/helpers/trackers';
import { MergedWorkspace, WorkspacesEventInfo } from '../types';

const UpdateIconButton = styled(TooltipIconButton)(({ theme }) => ({
  backgroundColor: theme.palette.white.main,
  color: theme.palette.primary.main,
  borderRadius: theme.spacing(0.5),
  border: `1px solid ${theme.palette.divider}`,
  height: '36.5px',
  svg: {
    fontSize: '1.25rem',
  },
}));

type WorkspacesUpdateButtonProps = {
  workspace: MergedWorkspace;
  dialogType: DialogType;
  tooltip?: string;
  disabled?: boolean;
  trackingInfo?: WorkspacesEventInfo;
} & Omit<TooltipButtonProps, 'tooltip'>;

function WorkspacesUpdateButton({
  workspace,
  dialogType,
  tooltip,
  disabled = false,
  trackingInfo,
  children,
  ...rest
}: WorkspacesUpdateButtonProps) {
  const currentWorkspaceIsRunning = isRunningWorkspace(workspace);
  const { open, setWorkspace, setDialogType } = useEditWorkspaceStore();

  const updatedTooltip = currentWorkspaceIsRunning
    ? 'Workspace cannot be edited while it is running. Stop jobs before editing.'
    : tooltip;

  return (
    <UpdateIconButton
      {...rest}
      disabled={currentWorkspaceIsRunning || disabled}
      onClick={() => {
        if (trackingInfo) {
          trackEvent(trackingInfo);
        }
        setWorkspace(workspace);
        setDialogType(dialogType);
        open();
      }}
      tooltip={updatedTooltip}
    >
      {children}
    </UpdateIconButton>
  );
}

export default WorkspacesUpdateButton;
