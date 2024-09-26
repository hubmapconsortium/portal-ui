import React from 'react';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledStack, StyledInfoIcon } from 'js/shared-styles/tooltips/DonorAgeTooltip/style';

const DONOR_AGE_TEXT = 'For donors older than 89, the metadata will indicate an age of 90.';

interface DonorAgeTooltipProps {
  donorAge?: string;
}

function DonorAgeTooltip({ donorAge }: DonorAgeTooltipProps) {
  if (!donorAge || Number(donorAge) <= 89) {
    return null;
  }

  return (
    <SecondaryBackgroundTooltip title={DONOR_AGE_TEXT}>
      <StyledStack>
        <StyledInfoIcon />
      </StyledStack>
    </SecondaryBackgroundTooltip>
  );
}
export default DonorAgeTooltip;
