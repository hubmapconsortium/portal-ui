import { useState, useCallback, useContext, useMemo } from 'react';
import { useSearchkitVariables } from '@searchkit/client';
import { CustomQuery } from '@searchkit/sdk';
import useDeepCompareEffect from 'use-deep-compare-effect';

import useSearchkitSDK from 'js/components/entity-search/searchkit-modifications/useSearchkitSDK';
import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { createSearchkitFacet } from 'js/components/entity-search/SearchWrapper/utils';
import { fetchSearchData } from 'js/hooks/useSearchData';

import { buildSortPairs, getRangeProps } from './utils';

function useAllResultsUUIDs() {
  const [queryBody, setQueryBody] = useState({});
  const [allResultsUUIDs, setAllResultsUUIDS] = useState([]);
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);

  const setQueryBodyAndReturnBody = useCallback(
    (body) => {
      setQueryBody(body);
      return body;
    },
    [setQueryBody],
  );

  useDeepCompareEffect(() => {
    async function getAndSetAllUUIDs() {
      const { query, post_filter } = queryBody;
      const allResults = await fetchSearchData(
        { query, post_filter, _source: false, size: 10000 },
        elasticsearchEndpoint,
        groupsToken,
      );
      // eslint-disable-next-line no-underscore-dangle
      setAllResultsUUIDS(allResults.hits.hits.map((hit) => hit._id));
    }
    getAndSetAllUUIDs();
  }, [queryBody]);

  return { allResultsUUIDs, setQueryBodyAndReturnBody };
}

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

function useSearch() {
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);
  const authHeader = getAuthHeader(groupsToken);
  const { fields, tileFields, facets, defaultFilters, entityType, numericFacetsProps } = useStore();

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
        fields: Object.values({ ...tileFields, ...fields }).map(({ identifier }) => identifier),
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
    tileFields,
  ]);

  const variables = useSearchkitVariables();
  const defaultSort = 'mapped_last_modified_timestamp.keyword.desc';
  const { results } = useSearchkitSDK({ config, variables, filters: defaultFilterValues, defaultSort });

  return { results, entityType, allResultsUUIDs };
}

export { useSearch };
