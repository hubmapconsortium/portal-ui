import React from 'react';
import { HitsStats } from 'searchkit';
import Typography from '@material-ui/core/Typography';

function ResultsFoundText({ hitsCount }) {
  return (
    <Typography variant="caption" color="secondary">
      {hitsCount} Results Found
    </Typography>
  );
}

function ResultsFound() {
  return <HitsStats component={ResultsFoundText} />;
}

export default ResultsFound;
