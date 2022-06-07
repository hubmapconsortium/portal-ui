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
import FacetChips from 'js/components/entity-search/facets/facetChips/FacetChips';
import { SearchLayout, ResultsLayout } from './style';
import { buildSortPairs, getRangeProps } from './utils';
import { useAllResultsUUIDs } from './hooks';
import MetadataMenu from '../MetadataMenu/MetadataMenu';

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
  const { fields, facets, defaultFilters, entityType } = useStore();

  const defaultFilterValues = Object.values(defaultFilters);

  const { allResultsUUIDs, setQueryBodyAndReturnBody } = useAllResultsUUIDs();

  const config = useMemo(() => {
    return {
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
      filters: defaultFilterValues.map((filter) => filter.definition),
      postProcessRequest: setQueryBodyAndReturnBody,
    };
  }, [
    authHeader,
    defaultFilterValues,
    elasticsearchEndpoint,
    facets,
    fields,
    numericFacetsProps,
    setQueryBodyAndReturnBody,
  ]);

  const transporter = new RequestTransporter(config);

  const variables = useSearchkitVariables();
  const defaultSort = 'mapped_last_modified_timestamp.keyword.desc';
  const { results } = useSearchkitSDK(config, variables, transporter, defaultFilterValues, defaultSort);

  return (
    <>
      <SearchBar />
      <MetadataMenu allResultsUUIDs={allResultsUUIDs} entityType={entityType} />
      {results?.summary.appliedFilters && <FacetChips appliedFilters={results.summary.appliedFilters} />}
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
