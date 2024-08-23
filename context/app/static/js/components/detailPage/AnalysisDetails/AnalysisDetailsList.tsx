import React from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import InfoTooltipIcon from 'js/shared-styles/icons/TooltipIcon';
import ProvAnalysisDetailsLink from './AnalysisDetailsLink';

interface ProvAnalysisDetailsListProps {
  pipelines: {
    hash: string;
    name?: string;
    origin: string;
  }[];
  pipelineType: string;
  tooltip?: string;
}

function ProvAnalysisDetailsList({ pipelines, pipelineType, tooltip }: ProvAnalysisDetailsListProps) {
  return (
    <>
      <Typography variant="subtitle2">
        {`${pipelineType} Pipelines`} <InfoTooltipIcon iconTooltipText={tooltip} />
      </Typography>
      <List data-testid={pipelineType}>
        {pipelines.map((item) => (
          <ProvAnalysisDetailsLink
            data={item}
            key={`provenance-analysis-details-${pipelineType.toLowerCase()}-pipeline-${item.hash}`}
          />
        ))}
      </List>
    </>
  );
}

export default ProvAnalysisDetailsList;
