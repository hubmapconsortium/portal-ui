import React, { useContext } from 'react';
import { ReactiveBase, ReactiveList } from '@appbaseio/reactivesearch';

import ResultsTable from 'js/components/test-search/results/ResultsTable';
import MultiList from 'js/components/test-search/filters/MultiList';
import { getAuthHeader } from 'js/helpers/functions';
import { AppContext } from 'js/components/Providers';

import { initialDatasetFilters, initialDatasetFields, FILTER_TYPES } from './initialConfig';
import { SearchLayout, SidebarLayout, ResultsLayout } from './style';

const filterComponents = {
  [FILTER_TYPES.multiList]: MultiList,
};

function Filter({ filterType, ...rest }) {
  const FilterComponent = filterComponents[filterType];
  return <FilterComponent {...rest} />;
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
      <SearchLayout>
        <SidebarLayout>
          {initialDatasetFilters.map((props) => (
            <Filter {...props} />
          ))}
        </SidebarLayout>
        <ResultsLayout>
          <ReactiveList
            componentId="results"
            size={18}
            pagination
            react={{
              and: initialDatasetFilters.map(({ componentId }) => componentId),
            }}
            includeFields={initialDatasetFields.map(({ field }) => field)}
            dataField="results"
            render={ResultsTable}
          />
        </ResultsLayout>
      </SearchLayout>
    </ReactiveBase>
  );
}

export default TestSearch;
