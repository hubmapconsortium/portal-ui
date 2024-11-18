import React from 'react';
import InfoTextTooltip from 'js/shared-styles/tooltips/InfoTextTooltip';
import { ProcessedDatasetDetails } from 'js/components/detailPage/ProcessedData/ProcessedDataset/hooks';

function ProcessedDataGroup({
  creation_action,
  group_name,
}: Pick<ProcessedDatasetDetails, 'creation_action' | 'group_name'>) {
  const isHiveProcessed = creation_action === 'Central Process';

  return isHiveProcessed ? (
    <InfoTextTooltip tooltipTitle="HuBMAP Integration, Visualization & Engagement.">HIVE</InfoTextTooltip>
  ) : (
    group_name
  );
}

export default ProcessedDataGroup;
