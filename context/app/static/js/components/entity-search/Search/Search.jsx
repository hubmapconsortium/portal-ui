import React, { useContext, useMemo } from 'react';

import { MultiMatchQuery } from '@searchkit/sdk';
import { useSearchkitVariables } from '@searchkit/client';

import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { createSearchkitFacet } from 'js/components/entity-search/SearchWrapper/utils';
import useSearchkitSDK from 'js/components/entity-search/searchkit-modifications/useSearchkitSDK';
import ResultsTable from 'js/components/entity-search/ResultsTable';
import Pagination from 'js/components/entity-search/results/Pagination';

import RequestTransporter from 'js/components/entity-search/searchkit-modifications/RequestTransporter';
import Sidebar from 'js/components/entity-search/sidebar/Sidebar';
import { SearchLayout, ResultsLayout } from './style';
import { buildSortPairs, getNumericFacetProps } from './utils';

function Search({ numericFacetsProps }) {
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);
  const authHeader = getAuthHeader(groupsToken);
  const { fields, facets, filters } = useStore();

  const config = useMemo(
    () => ({
      host: elasticsearchEndpoint,
      connectionOptions: {
        headers: {
          ...authHeader,
        },
      },
      hits: {
        fields: Object.values(fields).map(({ identifier }) => identifier),
      },
      sortOptions: buildSortPairs(Object.values(fields)),
      query: new MultiMatchQuery({
        fields: ['all_text'],
      }),
      facets: Object.values(facets).map((facet) =>
        createSearchkitFacet({ ...facet, ...getNumericFacetProps(facet.field, numericFacetsProps) }),
      ),
      filters: filters.map((filter) => filter.definition),
    }),
    [authHeader, elasticsearchEndpoint, facets, fields, filters, numericFacetsProps],
  );

  const transporter = new RequestTransporter(config);

  const variables = useSearchkitVariables();
  const { results } = useSearchkitSDK(config, variables, transporter, filters);

  return (
    <SearchLayout>
      <Sidebar results={results} />
      <ResultsLayout>
        {results?.hits && (
          <>
            <ResultsTable hits={results.hits} />
            <Pagination pageHits={results.hits.page} />
          </>
        )}
      </ResultsLayout>
    </SearchLayout>
  );
}

export default Search;
