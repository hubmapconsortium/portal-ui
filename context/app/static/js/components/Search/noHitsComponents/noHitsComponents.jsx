import React from 'react';

import { Alert } from 'js/shared-styles/alerts';

function NoResults() {
  return <Alert severity="warning">No results found. Check your spelling or unselect filters.</Alert>;
}

function SearchError() {
  return <Alert severity="error">An error occurred when fetching your results. Please try again.</Alert>;
}

export { NoResults, SearchError };
