import React from 'react';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import ProvAnalysisDetailsLink from './AnalysisDetailsLink';

interface ProvAnalysisDetailsListProps {
  pipelines: {
    hash: string;
    name?: string;
    origin: string;
  }[];
  pipelineType: string;
}

function ProvAnalysisDetailsList({ pipelines, pipelineType }: ProvAnalysisDetailsListProps) {
  return (
    <>
      <Typography variant="subtitle1">{`${pipelineType} Pipelines`}</Typography>
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
