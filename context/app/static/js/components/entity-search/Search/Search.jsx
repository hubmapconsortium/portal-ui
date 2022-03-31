import React, { useContext, useMemo } from 'react';
import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';

import { MultiMatchQuery, RefinementSelectFacet } from '@searchkit/sdk';
import { useSearchkitVariables } from '@searchkit/client';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
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
      index: '',
      hits: {
        fields: fields.map((field) => field.field),
      },
      query: new MultiMatchQuery({
        fields: ['all_text'],
      }),
      facets: facets.map(
        ({ field, identifier, label }) =>
          new RefinementSelectFacet({ field: `${field}.keyword`, identifier, label, multipleSelect: true }),
      ),
      filters: filters.map((filter) => filter.definition),
    }),
    [authHeader, elasticsearchEndpoint, facets, fields, filters],
  );

  const transporter = new RequestTransporter(config);

  const variables = useSearchkitVariables();
  const { results } = useSearchkitSDK(config, variables, transporter, filters);

  return results?.hits ? <ResultsTable hits={results.hits} /> : <div>Search</div>;
}

export default Search;
