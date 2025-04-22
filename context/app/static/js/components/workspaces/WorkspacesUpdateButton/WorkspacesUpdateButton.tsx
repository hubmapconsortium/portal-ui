import React from 'react';

import { isRunningWorkspace } from 'js/components/workspaces/utils';
import { TooltipButtonProps } from 'js/shared-styles/buttons/TooltipButton';
import { useEditWorkspaceStore, DialogType } from 'js/stores/useWorkspaceModalStore';
import { trackEvent } from 'js/helpers/trackers';
import { WorkspaceTooltipButton } from 'js/components/workspaces/WorkspaceButton/WorkspaceButton';
import { EventInfo } from 'js/components/types';
import { MergedWorkspace } from '../types';

type WorkspacesUpdateButtonProps = {
  workspace: MergedWorkspace;
  dialogType: DialogType;
  tooltip?: string;
  disabled?: boolean;
  trackingInfo?: EventInfo;
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
    <WorkspaceTooltipButton
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
    </WorkspaceTooltipButton>
  );
}

export default WorkspacesUpdateButton;
