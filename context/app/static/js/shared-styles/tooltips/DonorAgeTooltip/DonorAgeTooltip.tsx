import React, { PropsWithChildren } from 'react';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';

const DONOR_AGE_TEXT = 'For donors older than 89, the metadata will indicate an age of 90.';

interface DonorAgeTooltipProps extends PropsWithChildren {
  donorAge?: string;
}

function DonorAgeTooltip({ donorAge, children }: DonorAgeTooltipProps) {
  if (!donorAge || Number(donorAge) <= 89) {
    return children;
  }

  return <InfoTextTooltip tooltipTitle={DONOR_AGE_TEXT}>{children}</InfoTextTooltip>;
}
export default DonorAgeTooltip;
