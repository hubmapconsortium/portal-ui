import React from 'react';
import Stack from '@mui/material/Stack';

import { useEndButtons } from 'js/components/workspaces/Tables/WorkspaceItemsTable/hooks';
import { StyledSvgIcon } from 'js/components/workspaces/Tables/WorkspaceItemsTable/style';
import { WorkspaceItem } from 'js/components/workspaces/Tables/WorkspaceItemsTable/types';
import WorkspaceLaunchStopButtons from 'js/components/workspaces/WorkspaceLaunchStopButtons';
import { LaunchStopButton } from 'js/components/workspaces/WorkspaceLaunchStopButtons/WorkspaceLaunchStopButtons';
import { isWorkspace } from 'js/components/workspaces/utils';
import { RotatedTooltipButton } from 'js/shared-styles/buttons';
import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import IconDropdownMenu from 'js/shared-styles/dropdowns/IconDropdownMenu';
import { IconDropdownMenuItem } from 'js/shared-styles/dropdowns/IconDropdownMenu/IconDropdownMenu';
import { CheckIcon, CloseIcon, EyeIcon, MoreIcon } from 'js/shared-styles/icons';

const tooltips = {
  acceptInvite: 'Accept workspace copy invitation. This will create a copy of this workspace to your profile.',
  declineInvite: 'Decline invitation',
  previewInvite: 'Preview the details of this workspace',
  moreOptions: 'View additional actions',
};

function EndButtons({ item }: { item: WorkspaceItem }) {
  const {
    isAccepted,
    isSender,
    options,
    onAcceptInvite,
    onPreviewInvite,
    onDeclineInvite,
    handleStopWorkspace,
    isStoppingWorkspace,
  } = useEndButtons(item);

  // If the item is a workspace
  if (isWorkspace(item)) {
    return (
      <Stack direction="row" justifyContent="end" marginRight={2}>
        <WorkspaceLaunchStopButtons
          workspace={item}
          button={LaunchStopButton}
          handleStopWorkspace={handleStopWorkspace}
          isStoppingWorkspace={isStoppingWorkspace}
          showLaunch
          showStop
        />
      </Stack>
    );
  }

  // If the item is an accepted invitation
  if (isAccepted) {
    return null;
  }

  // If the item is a pending sent invitation
  if (isSender) {
    return (
      <Stack direction="row" justifyContent="end" alignItems="center">
        <IconDropdownMenu tooltip={tooltips.moreOptions} icon={MoreIcon} button={RotatedTooltipButton}>
          {options.map((props) => (
            <IconDropdownMenuItem key={props.icon.muiName} {...props} />
          ))}
        </IconDropdownMenu>
      </Stack>
    );
  }

  // If the item is a pending received invitation
  return (
    <Stack direction="row" justifyContent="end" alignItems="center">
      <TooltipIconButton tooltip={tooltips.declineInvite} onClick={onDeclineInvite}>
        <StyledSvgIcon as={CloseIcon} />
      </TooltipIconButton>
      <TooltipIconButton tooltip={tooltips.previewInvite} onClick={onPreviewInvite}>
        <StyledSvgIcon as={EyeIcon} color="primary" />
      </TooltipIconButton>
      <TooltipIconButton tooltip={tooltips.acceptInvite} onClick={onAcceptInvite}>
        <StyledSvgIcon as={CheckIcon} color="success" />
      </TooltipIconButton>
    </Stack>
  );
}

export default EndButtons;
