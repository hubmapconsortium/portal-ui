import React from 'react';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledIconDiv, StyledInfoIcon } from 'js/shared-styles/tooltips/DonorAgeTooltip/style';

export const DONOR_AGE_TEXT = 'For donors older than 89, the metadata will indicate an age of 90.';

interface DonorAgeTooltipProps {
  donorAge?: string;
}

function DonorAgeTooltip({ donorAge }: DonorAgeTooltipProps) {
  if (!donorAge || Number(donorAge) <= 89) {
    return null;
  }

  return (
    <SecondaryBackgroundTooltip title={DONOR_AGE_TEXT}>
      <StyledIconDiv>
        <StyledInfoIcon />
      </StyledIconDiv>
    </SecondaryBackgroundTooltip>
  );
}
export default DonorAgeTooltip;
