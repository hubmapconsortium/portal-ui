import React from 'react';

import SectionFooter from 'js/shared-styles/sections/SectionFooter';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { StyledInfoIcon } from './style';

const tooltipText =
  'HuBMAP data is managed and published in the Data Portal and Human Reference Atlas according to FAIR Principles, including standardized processing with reproducible pipelines. HuBMAP data may also be processed by other methods in scientific results published by HuBMAP consortium collaborations.';

function DataCaptionWithTooltip() {
  return (
    <>
      About this Data
      <SecondaryBackgroundTooltip title={tooltipText}>
        <StyledInfoIcon color="primary" />
      </SecondaryBackgroundTooltip>
    </>
  );
}

interface HubmapDataFooterProps {
  items?: unknown[];
}

function HubmapDataFooter({ items = [] }: HubmapDataFooterProps) {
  return (
    <SectionFooter
      items={[
        ...items,
        {
          key: 'hubmap-data-tooltip',
          component: <DataCaptionWithTooltip />,
        },
      ]}
    />
  );
}

export default HubmapDataFooter;
