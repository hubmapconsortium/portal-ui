import React, { useContext, useMemo } from 'react';
import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';

import { MultiMatchQuery, RefinementSelectFacet } from '@searchkit/sdk';
import { useSearchkitVariables } from '@searchkit/client';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import useSearchkitSDK from './useSearchkitSDK';
import RequestTransporter from './RequestTransporter';

function Search() {
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);
  const httpHeaders = getAuthHeader(groupsToken);
  const { fields, facets } = useStore();

  const config = useMemo(
    () => ({
      host: elasticsearchEndpoint,
      connectionOptions: {
        headers: {
          httpHeaders,
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
    }),
    [elasticsearchEndpoint, facets, fields, httpHeaders],
  );

  const transporter = new RequestTransporter(config);

  const variables = useSearchkitVariables();
  const { results } = useSearchkitSDK(config, variables, transporter);
  // eslint-disable-next-line no-console
  console.log(variables, results);
  return <div>Search</div>;
}

export default Search;
