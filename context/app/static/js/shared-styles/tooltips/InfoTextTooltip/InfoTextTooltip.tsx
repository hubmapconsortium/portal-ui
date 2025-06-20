import React, { PropsWithChildren } from 'react';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledInfoIcon, StyledOuterStack, StyledInnerStack } from 'js/shared-styles/tooltips/InfoTextTooltip/style';
import { Box } from '@mui/system';

interface InfoTextTooltipProps extends PropsWithChildren {
  tooltipTitle: string;
  infoIconSize?: 'small' | 'medium' | 'large'; // Optional prop to customize the font size of the info icon
}

function InfoTextTooltip({ tooltipTitle, children, infoIconSize }: InfoTextTooltipProps) {
  return (
    <StyledOuterStack>
      <Box display="inline-block" component="span">
        {children}
      </Box>
      <SecondaryBackgroundTooltip title={tooltipTitle} role="definition">
        <StyledInnerStack>
          <StyledInfoIcon fontSize={infoIconSize} />
        </StyledInnerStack>
      </SecondaryBackgroundTooltip>
    </StyledOuterStack>
  );
}
export default InfoTextTooltip;
