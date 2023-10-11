import React from 'react';

import ResultsTable from 'js/components/entity-search/ResultsTable';
import Pagination from 'js/components/entity-search/results/Pagination';
import { useSearchConfigStore } from 'js/components/entity-search/SearchWrapper/store';
import ResultsTiles from 'js/components/entity-search/results/ResultsTiles/';
import { ResultsLayout } from './style';

const resultsComponents = { table: ResultsTable, tile: ResultsTiles };

function Results({ results, allResultsUUIDs }) {
  const { view } = useSearchConfigStore();

  const ResultsComponent = resultsComponents[view];
  return (
    <ResultsLayout>
      {results?.hits && (
        <>
          <ResultsComponent hits={results.hits} allResultsUUIDs={allResultsUUIDs} />
          <Pagination pageHits={results.hits.page} />
        </>
      )}
    </ResultsLayout>
  );
}

export default Results;
