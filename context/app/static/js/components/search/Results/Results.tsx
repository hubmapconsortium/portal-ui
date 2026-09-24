import React from 'react';

import { useAppContext } from 'js/components/Contexts';
import { Alert } from 'js/shared-styles/alerts';
import { useSearch } from '../Search';
import ResultsTable from './ResultsTable';
import ResultsTiles from './ResultsTiles';
import FilesResultsTable from './files/FilesResultsTable';
import { useSearchStore } from '../store';
import { isFileSearch } from '../utils';

function NoResults() {
  const { isAuthenticated } = useAppContext();
  const message = isAuthenticated ? 'Check your spelling or unselect filters.' : 'Login to view more results.';
  return <Alert severity="warning">{`No results found. ${message}`}</Alert>;
}

const Results = React.memo(function Results({
  length,
  isLoading,
  view,
  isFiles,
}: {
  length: number;
  isLoading: boolean;
  view: string;
  isFiles: boolean;
}) {
  const noResults = !isLoading && !length;

  // Files results are grouped one row per dataset and carry their own transfer actions, so
  // they use a dedicated table rather than the entity one. They have no tile view.
  if (isFiles) {
    return (
      <>
        <FilesResultsTable isLoading={isLoading} />
        {noResults && <NoResults />}
      </>
    );
  }

  if (view === 'tile') {
    return noResults ? <NoResults /> : <ResultsTiles />;
  }

  return (
    <>
      <ResultsTable isLoading={isLoading} />
      {noResults && <NoResults />}
    </>
  );
});

function R() {
  const {
    searchHits: { length },
    isLoading,
  } = useSearch();
  const view = useSearchStore((state) => state.view);
  const type = useSearchStore((state) => state.type);

  return <Results length={length} view={view} isLoading={isLoading} isFiles={isFileSearch(type)} />;
}

export default R;
