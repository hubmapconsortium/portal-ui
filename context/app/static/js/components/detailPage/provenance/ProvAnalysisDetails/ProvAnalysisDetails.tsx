import React from 'react';

import { DagProvenanceType } from 'js/components/types';
import ProvAnalysisDetailsList from '../ProvAnalysisDetailsList';

interface ProvAnalysisDetailsProps {
  dagListData: DagProvenanceType[];
}

function ProvAnalysisDetails({ dagListData }: ProvAnalysisDetailsProps) {
  const ingestPipelines = dagListData.filter((pipeline) => !('name' in pipeline));
  const cwlPipelines = dagListData.filter((pipeline) => 'name' in pipeline);

  return (
    <div>
      {ingestPipelines.length > 0 && <ProvAnalysisDetailsList pipelines={ingestPipelines} pipelineType="Ingest" />}
      {cwlPipelines.length > 0 && <ProvAnalysisDetailsList pipelines={cwlPipelines} pipelineType="CWL" />}
    </div>
  );
}

export default ProvAnalysisDetails;
