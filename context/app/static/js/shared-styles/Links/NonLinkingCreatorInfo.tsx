import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';

function NonLinkingCreatorInfo({ creatorInfo }: { creatorInfo: string }) {
  if (creatorInfo === 'Me') {
    return <Typography>Me</Typography>;
  }

  return (
    <Stack direction="row" alignItems="center">
      <Typography>Unknown</Typography>
      <InfoTooltipIcon iconTooltipText="Original creator has deleted workspace" />
    </Stack>
  );
}

export default NonLinkingCreatorInfo;
