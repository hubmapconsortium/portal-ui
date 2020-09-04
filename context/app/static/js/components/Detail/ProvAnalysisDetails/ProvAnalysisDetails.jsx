import React from 'react';
import PropTypes from 'prop-types';

import ProvAnalysisDetailsList from 'js/components/Detail/ProvAnalysisDetailsList';

function ProvAnalysisDetails(props) {
  const { dagListData } = props;

  const ingestPipelines = dagListData.filter((pipeline) => !('name' in pipeline));
  const cwlPipelines = dagListData.filter((pipeline) => 'name' in pipeline);

  return (
    <div>
      <ProvAnalysisDetailsList pipelines={ingestPipelines} pipelineType="Ingest" />
      <ProvAnalysisDetailsList pipelines={cwlPipelines} pipelineType="CWL" />
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
