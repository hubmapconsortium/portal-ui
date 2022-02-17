import React, { useContext } from 'react';
import { ReactiveBase, ReactiveList, DataSearch } from '@appbaseio/reactivesearch';

import ResultsTable from 'js/components/entitySearch/results/ResultsTable';
import { getAuthHeader } from 'js/helpers/functions';
import { AppContext } from 'js/components/Providers';
import Filter from 'js/components/entitySearch/filters/Filter';
import { useStore } from 'js/pages/entitySearch/searchConfig/store';
import { SearchLayout, SidebarLayout, ResultsLayout } from './style';

const searchComponentID = 'searchinput';

function EntitySearch() {
  const { testsearchEndpoint, groupsToken } = useContext(AppContext);
  const httpHeaders = { ...getAuthHeader(groupsToken) };
  const { filters, fields } = useStore();

  const filtersComponentIds = filters.map(({ componentId }) => componentId);
  return (
    <ReactiveBase app="hm_public_portal" url={testsearchEndpoint} headers={httpHeaders}>
      <DataSearch componentId={searchComponentID} dataField={['all_text']} autosuggest={false} URLParams />
      <SearchLayout>
        <SidebarLayout>
          {filters.map(({ componentId, ...rest }) => (
            <Filter
              componentId={componentId}
              react={{ and: [searchComponentID, ...filtersComponentIds.filter((id) => componentId !== id)] }}
              {...rest}
            />
          ))}
        </SidebarLayout>
        <ResultsLayout>
          <ReactiveList
            componentId="results"
            size={18}
            pagination
            react={{
              and: [searchComponentID, ...filters.map(({ componentId }) => componentId)],
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

export default EntitySearch;
