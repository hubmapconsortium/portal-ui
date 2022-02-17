import React, { useContext } from 'react';
import { ReactiveBase, ReactiveList, DataSearch } from '@appbaseio/reactivesearch';

import ResultsTable from 'js/components/test-search/results/ResultsTable';
import { getAuthHeader } from 'js/helpers/functions';
import { AppContext } from 'js/components/Providers';
import Filter from 'js/components/test-search/filters/Filter';
import { useStore } from 'js/pages/TestSearch/searchConfig/store';
import { withSearchConfigProvider } from './searchConfig/provider';
import { initialDatasetFilters, initialDatasetFields } from './initialConfig';
import { SearchLayout, SidebarLayout, ResultsLayout } from './style';

function TestSearch() {
  const { testsearchEndpoint, groupsToken } = useContext(AppContext);
  const httpHeaders = { ...getAuthHeader(groupsToken) };
  const { filters, fields } = useStore();

  const filtersComponentIds = filters.map(({ componentId }) => componentId);
  return (
    <ReactiveBase app="hm_public_portal" url={testsearchEndpoint} headers={httpHeaders}>
      <DataSearch componentId="searchinput" dataField={['all_text']} autosuggest={false} URLParams />
      <SearchLayout>
        <SidebarLayout>
          {filters.map((props) => (
            <Filter {...props} filtersComponentIds={filtersComponentIds} />
          ))}
        </SidebarLayout>
        <ResultsLayout>
          <ReactiveList
            componentId="results"
            size={18}
            pagination
            react={{
              and: ['searchinput', ...filters.map(({ componentId }) => componentId)],
            }}
            includeFields={fields.map(({ field }) => field)}
            dataField="results"
            render={ResultsTable}
          />
        </ResultsLayout>
      </SearchLayout>
    </ReactiveBase>
  );
}

export default withSearchConfigProvider(TestSearch, {
  filters: initialDatasetFilters,
  fields: initialDatasetFields,
});
