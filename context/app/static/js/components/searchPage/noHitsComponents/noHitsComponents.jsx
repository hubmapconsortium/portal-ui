import React from 'react';
import PropTypes from 'prop-types';

import { Alert } from 'js/shared-styles/alerts';

function NoResults({ isLoggedIn }) {
  const message = isLoggedIn ? 'Check your spelling or unselect filters.' : 'Login to view more results.';
  return <Alert severity="warning">{`No results found. ${message}`}</Alert>;
}

NoResults.propTypes = {
  isLoggedIn: PropTypes.bool,
};

NoResults.defaultProps = {
  isLoggedIn: false,
};

function SearchError() {
  return <Alert severity="error">An error occurred when fetching your results. Please try again.</Alert>;
}

export { NoResults, SearchError };
