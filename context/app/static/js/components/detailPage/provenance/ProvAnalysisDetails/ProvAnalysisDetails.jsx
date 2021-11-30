import React from 'react';
import PropTypes from 'prop-types';

import ProvAnalysisDetailsList from '../ProvAnalysisDetailsList';

function ProvAnalysisDetails(props) {
  const { dagListData } = props;

  const ingestPipelines = dagListData.filter((pipeline) => !('name' in pipeline));
  const cwlPipelines = dagListData.filter((pipeline) => 'name' in pipeline);

  return (
    <div>
      {ingestPipelines.length > 0 && <ProvAnalysisDetailsList pipelines={ingestPipelines} pipelineType="Ingest" />}
      {cwlPipelines.length > 0 && <ProvAnalysisDetailsList pipelines={cwlPipelines} pipelineType="CWL" />}
    </div>
  );
}

ProvAnalysisDetails.propTypes = {
  dagListData: PropTypes.arrayOf(
    PropTypes.shape({
      hash: PropTypes.string,
      name: PropTypes.string,
      origin: PropTypes.string,
    }),
  ).isRequired,
};

export default ProvAnalysisDetails;
