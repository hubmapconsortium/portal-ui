import React from 'react';
import PropTypes from 'prop-types';
import { HitsStats } from 'searchkit';

import { StyledTypography } from './style';

function ResultsFoundText({ hitsCount }) {
  return (
    <StyledTypography variant="caption" color="secondary">
      {hitsCount} Results Found
    </StyledTypography>
  );
}

ResultsFoundText.propTypes = {
  hitsCount: PropTypes.number.isRequired,
};

function ResultsFound() {
  return <HitsStats component={ResultsFoundText} />;
}

export default ResultsFound;
