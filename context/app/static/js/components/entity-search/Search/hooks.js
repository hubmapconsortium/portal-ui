import { useState, useCallback, useContext, useMemo } from 'react';
import { useSearchkitVariables } from '@searchkit/client';
import { CustomQuery } from '@searchkit/sdk';

import useSearchkitSDK from 'js/components/entity-search/searchkit-modifications/useSearchkitSDK';
import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { createSearchkitFacet } from 'js/components/entity-search/SearchWrapper/utils';

import { buildSortPairs, getRangeProps } from './utils';

function useQueryBody() {
  const [queryBody, setQueryBody] = useState({});

  const setQueryBodyAndReturnBody = useCallback(
    (body) => {
      setQueryBody(body);
      return body;
    },
    [setQueryBody],
  );

  return { queryBody, setQueryBodyAndReturnBody };
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
  const { fields, tileFields, facets, defaultFilters, entityType, numericFacetsProps, availableFields } = useStore();

  const defaultFilterValues = Object.values(defaultFilters);

  const defaultSortConfig = availableFields.mapped_last_modified_timestamp;

  const { queryBody, setQueryBodyAndReturnBody } = useQueryBody();

  const config = useMemo(() => {
    return {
      host: elasticsearchEndpoint,
      connectionOptions: {
        headers: {
          ...authHeader,
        },
      },
      hits: {
        fields: Object.values({
          ...tileFields,
          ...fields,
        }).map(({ identifier }) => identifier),
      },
      sortOptions: buildSortPairs([...Object.values(fields), defaultSortConfig]),
      query,
      facets: Object.values(facets).map((facet) =>
        createSearchkitFacet({ ...facet, ...getRangeProps(facet.field, numericFacetsProps) }),
      ),
      filters: defaultFilterValues.map((filter) => filter.definition),
      postProcessRequest: setQueryBodyAndReturnBody,
      pageSize: 18,
    };
  }, [
    authHeader,
    defaultFilterValues,
    elasticsearchEndpoint,
    facets,
    fields,
    defaultSortConfig,
    numericFacetsProps,
    setQueryBodyAndReturnBody,
    tileFields,
  ]);

  const variables = useSearchkitVariables();
  const { results, allResultsUUIDs } = useSearchkitSDK({
    config,
    variables,
    filters: defaultFilterValues,
    defaultSort: `${defaultSortConfig.field}.desc`,
    queryBody,
    elasticsearchEndpoint,
    groupsToken,
  });

  return { results, entityType, allResultsUUIDs };
}

export { useSearch };
