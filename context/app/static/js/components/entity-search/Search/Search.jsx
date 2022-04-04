import React, { useContext, useMemo } from 'react';

import { MultiMatchQuery } from '@searchkit/sdk';
import { useSearchkitVariables } from '@searchkit/client';

import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { createFacet } from 'js/components/entity-search/SearchWrapper/utils';
import useSearchkitSDK from 'js/components/entity-search/searchkit-modifications/useSearchkitSDK';
import ResultsTable from 'js/components/entity-search/ResultsTable';
import RequestTransporter from 'js/components/entity-search/searchkit-modifications/RequestTransporter';

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
