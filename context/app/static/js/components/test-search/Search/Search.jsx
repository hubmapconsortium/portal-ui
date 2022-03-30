import React, { useContext } from 'react';
import { AppContext } from 'js/components/Providers';
import { getAuthHeader } from 'js/helpers/functions';

import { MultiMatchQuery, RefinementSelectFacet } from '@searchkit/sdk';
import { useSearchkitVariables } from '@searchkit/client';
import useSearchkitSDK from './useSearchkitSDK';
import RequestTransporter from './RequestTransporter';

function Search() {
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);
  const httpHeaders = getAuthHeader(groupsToken);

  const config = {
    host: elasticsearchEndpoint,
    connectionOptions: {
      headers: {
        httpHeaders,
      },
    },
    index: '',
    hits: {
      fields: ['uuid', 'entity_type.keyword'],
    },
    query: new MultiMatchQuery({
      fields: ['all_text'],
    }),
    facets: [
      new RefinementSelectFacet({
        field: 'entity_type.keyword',
        identifier: 'entity_type',
        label: 'Entity Type',
        multipleSelect: true,
      }),
    ],
  };

  const transporter = new RequestTransporter(config);

  const variables = useSearchkitVariables();
  const { results } = useSearchkitSDK(config, variables, transporter);
  // eslint-disable-next-line no-console
  console.log(variables, results);
  return <div>Search</div>;
}

export default Search;
