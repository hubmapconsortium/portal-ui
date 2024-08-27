import React from 'react';

import { DagProvenanceType } from 'js/components/types';
import AnalysisDetailsList from './AnalysisDetailsList';

interface AnalysisDetails {
  dagListData: DagProvenanceType[];
}

function AnalysisDetails({ dagListData }: AnalysisDetails) {
  const ingestPipelines = dagListData.filter((pipeline) => !('name' in pipeline));
  const cwlPipelines = dagListData.filter((pipeline) => 'name' in pipeline);

  return (
    <div>
      {ingestPipelines.length > 0 && (
        <AnalysisDetailsList
          pipelines={ingestPipelines}
          pipelineType="Ingest"
          tooltip="Supplementary links for the data ingestion pipelines for this dataset"
        />
      )}
      {cwlPipelines.length > 0 && (
        <AnalysisDetailsList
          pipelines={cwlPipelines}
          pipelineType="CWL"
          tooltip="Supplementary links for the CWL (Common Workflow Language) pipelines for this dataset"
        />
      )}
    </div>
  );
}

export default AnalysisDetails;
