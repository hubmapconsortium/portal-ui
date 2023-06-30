import React from 'react';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledTypography, StyledInfoIcon } from './style';

const tooltipText =
  'HuBMAP data is managed and published in the Data Portal and Human Reference Atlas according to FAIR Principles, including standardized processing with reproducible pipelines. HuBMAP data may also be processed by other methods in scientific results published by HuBMAP consortium collaborations.';

function AboutThisDataCaption() {
  return (
    <StyledTypography variant="caption" align="center">
      About this Data
      <SecondaryBackgroundTooltip title={tooltipText}>
        <StyledInfoIcon color="primary" />
      </SecondaryBackgroundTooltip>
    </StyledTypography>
  );
}

export default AboutThisDataCaption;
