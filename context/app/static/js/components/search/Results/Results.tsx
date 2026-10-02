import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import { Alert } from 'js/shared-styles/alerts';
import { useSearch } from '../Search';
import ResultsTable from './ResultsTable';
import ResultsTiles from './ResultsTiles';
import FilesResultsTable from './files/FilesResultsTable';
import { useSearchStore } from '../store';
import { isFileSearch } from '../utils';
import { SWRError } from 'js/helpers/swr/errors';

function NoResults() {
  const { isAuthenticated } = useAppContext();
  const message = isAuthenticated ? 'Check your spelling or unselect filters.' : 'Login to view more results.';
  return <Alert severity="warning">{`No results found. ${message}`}</Alert>;
}

function SearchError({ error }: { error: unknown }) {
  const status = error instanceof SWRError && error.status ? ` (HTTP ${error.status})` : '';
  return (
    <Alert severity="error">
      {`Search results could not be loaded${status}. Try reloading the page. If this problem persists, submit a bug report.`}
    </Alert>
  );
}

const Results = React.memo(function Results({
  length,
  isLoading,
  view,
  isFiles,
  error,
}: {
  length: number;
  isLoading: boolean;
  view: string;
  isFiles: boolean;
  error: unknown;
}) {
  const noResults = !error && !isLoading && !length;
  const searchError = error ? <SearchError error={error} /> : null;

  // Files results are grouped one row per dataset and carry their own transfer actions, so
  // they use a dedicated table rather than the entity one. They have no tile view.
  if (isFiles) {
    return (
      <>
        {searchError}
        <FilesResultsTable isLoading={isLoading} />
        {noResults && <NoResults />}
      </>
    );
  }

  if (view === 'tile') {
    return (
      <>
        {searchError}
        {noResults ? <NoResults /> : <ResultsTiles />}
      </>
    );
  }

  return (
    <>
      {searchError}
      <ResultsTable isLoading={isLoading} />
      {noResults && <NoResults />}
    </>
  );
});

function R() {
  const {
    searchHits: { length },
    isLoading,
    error,
  } = useSearch();
  const view = useSearchStore((state) => state.view);
  const type = useSearchStore((state) => state.type);

  return <Results length={length} view={view} isLoading={isLoading} isFiles={isFileSearch(type)} error={error} />;
}

export default R;
