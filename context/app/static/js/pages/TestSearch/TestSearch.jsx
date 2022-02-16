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
  const { testsearchEndpoint, groupsToken } = useContext(AppContext);
  const httpHeaders = { ...getAuthHeader(groupsToken) };

  return (
    <ReactiveBase app="hm_public_portal" url={testsearchEndpoint} headers={httpHeaders}>
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
