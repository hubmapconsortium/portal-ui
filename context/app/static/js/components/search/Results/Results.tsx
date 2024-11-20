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

const Results = React.memo(function Results({
  length,
  isLoading,
  view,
}: {
  length: number;
  isLoading: boolean;
  view: string;
}) {
  if (!isLoading && !length) {
    return <NoResults />;
  }

  if (view === 'tile') {
    return <ResultsTiles />;
  }

  return <ResultsTable isLoading={isLoading} />;
});

function R() {
  const {
    searchHits: { length },
    isLoading,
  } = useSearch();
  const view = useSearchStore((state) => state.view);

  return <Results length={length} view={view} isLoading={isLoading} />;
}

export default R;
