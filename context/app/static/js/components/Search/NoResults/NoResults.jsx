import React from 'react';

import { Alert } from 'js/shared-styles/alerts';

function NoResults() {
  return <Alert severity="warning">No Results Found. Check your spelling or unselect filters.</Alert>;
}

export default NoResults;
