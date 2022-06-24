import React from 'react';

import { SearchkitClient, withSearchkit, withSearchkitRouting } from '@searchkit/client';

import { routeToStateWithDefaultPageSize } from 'js/components/entity-search/searchkit-modifications/routeToState';
import ResultsTable from 'js/components/entity-search/ResultsTable';
import Pagination from 'js/components/entity-search/results/Pagination';
import Sidebar from 'js/components/entity-search/sidebar/Sidebar';
import SearchBar from 'js/components/entity-search/SearchBar';
import FacetChips from 'js/components/entity-search/facets/facetChips/FacetChips';
import { Flex, Grow, ResultsLayout } from './style';
import { useSearch } from './hooks';
import MetadataMenu from '../MetadataMenu/MetadataMenu';

const defaultPageSize = 18;

const routeToState = routeToStateWithDefaultPageSize(defaultPageSize);

const createSkClient = () =>
  new SearchkitClient({
    itemsPerPage: defaultPageSize,
  });

function Search() {
  const { results, allResultsUUIDs, entityType } = useSearch();
  return (
    <>
      <Flex>
        <Grow>
          <SearchBar />
        </Grow>
        <MetadataMenu allResultsUUIDs={allResultsUUIDs} entityType={entityType} />
      </Flex>
      {results?.summary.appliedFilters && <FacetChips appliedFilters={results.summary.appliedFilters} />}
      <Flex>
        <Sidebar results={results} />
        <ResultsLayout>
          {results?.hits && (
            <>
              <ResultsTable hits={results.hits} />
              <Pagination pageHits={results.hits.page} />
            </>
          )}
        </ResultsLayout>
      </Flex>
    </>
  );
}

export default withSearchkit(withSearchkitRouting(Search, { routeToState }), createSkClient);
