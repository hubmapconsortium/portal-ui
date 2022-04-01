import React, { useContext, useMemo } from 'react';
import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';

import { MultiMatchQuery } from '@searchkit/sdk';
import { useSearchkitVariables } from '@searchkit/client';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { createFacet } from 'js/components/entity-search/SearchWrapper/utils';
import useSearchkitSDK from './useSearchkitSDK';
import RequestTransporter from './RequestTransporter';

import ResultsTable from '../ResultsTable';

function Search() {
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
        fields: fields.map((field) => field.field),
      },
      query: new MultiMatchQuery({
        fields: ['all_text'],
      }),
      facets: facets.map((facet) => createFacet(facet)),
      filters: filters.map((filter) => filter.definition),
    }),
    [authHeader, elasticsearchEndpoint, facets, fields, filters],
  );

  const transporter = new RequestTransporter(config);

  const variables = useSearchkitVariables();
  const { results } = useSearchkitSDK(config, variables, transporter, filters);

  return results?.hits ? <ResultsTable hits={results.hits} /> : null;
}

export default Search;
