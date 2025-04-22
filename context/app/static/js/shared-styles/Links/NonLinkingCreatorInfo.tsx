import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { WorkspaceCreatorInfo, WorkspaceUser } from 'js/components/workspaces/types';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';

function NonLinkingCreatorInfo({ creatorInfo }: { creatorInfo: Exclude<WorkspaceCreatorInfo, WorkspaceUser> }) {
  if (creatorInfo === 'Unknown') {
    return (
      <Stack direction="row" alignItems="center">
        <Typography>Unknown</Typography>
        <InfoTooltipIcon iconTooltipText="Original creator has deleted workspace" />
      </Stack>
    );
  }

  if (creatorInfo === 'Me') {
    return <Typography>Me</Typography>;
  }

  return null;
}

export default NonLinkingCreatorInfo;
