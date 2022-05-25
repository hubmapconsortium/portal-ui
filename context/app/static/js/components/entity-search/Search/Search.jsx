import React, { useContext, useMemo } from 'react';

import { useSearchkitVariables } from '@searchkit/client';
import { CustomQuery } from '@searchkit/sdk';

import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { createSearchkitFacet } from 'js/components/entity-search/SearchWrapper/utils';
import useSearchkitSDK from 'js/components/entity-search/searchkit-modifications/useSearchkitSDK';
import ResultsTable from 'js/components/entity-search/ResultsTable';
import Pagination from 'js/components/entity-search/results/Pagination';

import RequestTransporter from 'js/components/entity-search/searchkit-modifications/RequestTransporter';
import Sidebar from 'js/components/entity-search/sidebar/Sidebar';
import SearchBar from 'js/components/entity-search/SearchBar';
import { SearchLayout, ResultsLayout } from './style';
import { buildSortPairs, getRangeProps } from './utils';

const query = new CustomQuery({
  queryFn: (q) => {
    return {
      bool: {
        must: [
          {
            simple_query_string: {
              fields: ['all_text', 'description'],
              query: q.match(/^\s*HBM\S+\s*$/i) ? `"${q}"` : q,
            },
          },
        ],
      },
    };
  },
});

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
      query,
      facets: Object.values(facets).map((facet) =>
        createSearchkitFacet({ ...facet, ...getRangeProps(facet.field, numericFacetsProps) }),
      ),
      filters: filters.map((filter) => filter.definition),
    }),
    [authHeader, elasticsearchEndpoint, facets, fields, filters, numericFacetsProps],
  );

  const transporter = new RequestTransporter(config);

  const variables = useSearchkitVariables();
  const { results } = useSearchkitSDK(config, variables, transporter, filters);

  return (
    <>
      <SearchBar />
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
    </>
  );
}

export default Search;
