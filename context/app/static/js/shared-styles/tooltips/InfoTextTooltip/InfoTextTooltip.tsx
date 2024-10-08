import React, { PropsWithChildren } from 'react';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledInfoIcon, StyledOuterStack, StyledInnerStack } from 'js/shared-styles/tooltips/InfoTextTooltip/style';

interface InfoTextTooltipProps extends PropsWithChildren {
  tooltipTitle: string;
}

function InfoTextTooltip({ tooltipTitle, children }: InfoTextTooltipProps) {
  return (
    <StyledOuterStack>
      {children}
      <SecondaryBackgroundTooltip title={tooltipTitle}>
        <StyledInnerStack>
          <StyledInfoIcon />
        </StyledInnerStack>
      </SecondaryBackgroundTooltip>
    </StyledOuterStack>
  );
}
export default InfoTextTooltip;
