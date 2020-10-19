import React from 'react';
import PropTypes from 'prop-types';
import { HitsStats } from 'searchkit';
import Typography from '@material-ui/core/Typography';

function ResultsFoundText({ hitsCount }) {
  return (
    <Typography variant="caption" color="secondary">
      {hitsCount} Results Found
    </Typography>
  );
}

ResultsFoundText.propTypes = {
  hitsCount: PropTypes.number.isRequired,
};

function ResultsFound() {
  return <HitsStats component={ResultsFoundText} />;
}

export default ResultsFound;
