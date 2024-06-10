import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import { Alert } from 'js/shared-styles/alerts';
import { useSearch } from '../Search';
import ResultsTable from './ResultsTable';

function NoResults() {
  const { isAuthenticated } = useAppContext();
  const message = isAuthenticated ? 'Check your spelling or unselect filters.' : 'Login to view more results.';
  return <Alert severity="warning">{`No results found. ${message}`}</Alert>;
}

function Results() {
  const {
    searchHits: { length },
  } = useSearch();

  if (!length) {
    return <NoResults />;
  }

  return <ResultsTable />;
}

export default Results;
