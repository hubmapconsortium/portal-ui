import React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';

function NonLinkingCreatorInfo({ creatorInfo }: { creatorInfo: string }) {
  // Rendered inside LabelledSectionText's <p>, so keep everything inline.
  if (creatorInfo === 'Me') {
    return <Typography component="span">Me</Typography>;
  }

  return (
    <Stack component="span" direction="row" alignItems="center" sx={{ display: 'inline-flex' }}>
      <Typography component="span">Unknown</Typography>
      <InfoTooltipIcon iconTooltipText="Original creator has deleted workspace" />
    </Stack>
  );
}

export default NonLinkingCreatorInfo;
