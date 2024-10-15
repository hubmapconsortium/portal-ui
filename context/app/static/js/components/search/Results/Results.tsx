import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import { Alert } from 'js/shared-styles/alerts';
import { useSearch } from '../Search';
import ResultsTable from './ResultsTable';
import ResultsTiles from './ResultsTiles';
import { useSearchStore } from '../store';

function NoResults() {
  const { isAuthenticated } = useAppContext();
  const message = isAuthenticated ? 'Check your spelling or unselect filters.' : 'Login to view more results.';
  return <Alert severity="warning">{`No results found. ${message}`}</Alert>;
}

function Results() {
  const {
    searchHits: { length },
    isLoading,
  } = useSearch();

  const { view } = useSearchStore();

  if (!isLoading && !length) {
    return <NoResults />;
  }

  if (view === 'tile') {
    return <ResultsTiles />;
  }

  return <ResultsTable />;
}

export default Results;
