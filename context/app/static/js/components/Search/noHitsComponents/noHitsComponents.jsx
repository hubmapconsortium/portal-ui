import React from 'react';

import { Alert } from 'js/shared-styles/alerts';

function NoResults() {
  return <Alert severity="warning">No Results Found. Check your spelling or unselect filters.</Alert>;
}

function SearchError() {
  return <Alert severity="error">An issue occurred when fetching your results. Please try again. </Alert>;
}

export { NoResults, SearchError };
