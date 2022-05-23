import React from 'react';

import { StyledTypography } from './style';

function ResultsFound({ totalHits }) {
  return (
    <StyledTypography variant="caption" color="secondary">
      {totalHits} Results Found
    </StyledTypography>
  );
}

export default ResultsFound;
