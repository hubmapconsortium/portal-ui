import React, { useContext } from 'react';
import { ReactiveBase, ReactiveList } from '@appbaseio/reactivesearch';

import MultiList from 'js/components/test-search/filters/MultiList';
import { getAuthHeader } from 'js/helpers/functions';
import { AppContext } from 'js/components/Providers';

function ListItem({ uuid }) {
  return <div>{uuid}</div>;
}

function TestSearch() {
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);
  const httpHeaders = { ...getAuthHeader(groupsToken), Accept: 'application/json', 'Content-Type': 'application/json' }; // reactivesearch sends ndjson by default

  return (
    <ReactiveBase
      app="search-api"
      url={elasticsearchEndpoint}
      headers={httpHeaders}
      transformRequest={(props) => {
        // our es cluster is wrapped in a REST API which only exposes /search
        return {
          ...props,
          body: JSON.stringify(
            props.body
              .split('\n')
              .slice(0, -1)
              .map((s) => JSON.parse(s))[1],
          ), // only send query json from ndjson body
          url: props.url.replace('search-api/_msearch?', ''), // reactivesearch points at /_msearch by default
        };
      }}
    >
      <MultiList componentId="mapped_data_types-filter" dataField="mapped_data_types.keyword" title="Data Type" />
      <ReactiveList
        componentId="results"
        size={6}
        pagination
        react={{
          and: ['mapped_data_types-filter'],
        }}
        includeFields={['uuid']}
        renderItem={ListItem}
      />
    </ReactiveBase>
  );
}

export default TestSearch;
