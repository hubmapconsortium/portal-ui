/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import ProvAnalysisDetailsLink from '../ProvAnalysisDetailsLink';

function ProvAnalysisDetailsList({ pipelines, pipelineType }) {
  return (
    <>
      <Typography variant="subtitle1">{`${pipelineType} Pipelines`}</Typography>
      <List data-testid={pipelineType}>
        {pipelines.map((item, i) => (
          <ProvAnalysisDetailsLink
            data={item}
            key={`provenance-analysis-details-${pipelineType.toLowerCase()}-pipeline-${i}`}
          />
        ))}
      </List>
    </>
  );
}

ProvAnalysisDetailsList.propTypes = {
  pipelines: PropTypes.arrayOf(
    PropTypes.shape({
      hash: PropTypes.string,
      name: PropTypes.string,
      origin: PropTypes.string,
    }),
  ).isRequired,
  pipelineType: PropTypes.string.isRequired,
};

export default ProvAnalysisDetailsList;
