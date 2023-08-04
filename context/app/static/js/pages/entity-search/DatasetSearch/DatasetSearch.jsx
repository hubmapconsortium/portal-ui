import React from 'react';

import { Provider, createStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import SearchWrapper from 'js/components/entity-search/SearchWrapper';
import { createDatasetFacet, buildDatasetFields } from 'js/components/entity-search/SearchWrapper/utils';

const { tableFields } = buildDatasetFields();

const facets = Object.assign(
  createDatasetFacet({ fieldName: 'mapped_data_types', label: 'Data Type', type: 'string' }),
  createDatasetFacet({ fieldName: 'origin_samples.mapped_organ', label: 'Organ', type: 'string' }),
  createDatasetFacet({ fieldName: 'source_samples.sample_category', label: 'Sample Category', type: 'string' }),
  createDatasetFacet({ fieldName: 'mapped_consortium', label: 'Consortium', type: 'string' }),
  createDatasetFacet({ fieldName: 'mapped_status', label: 'Status', type: 'string' }),
  createDatasetFacet({ fieldName: 'mapped_data_access_level', label: 'Access Level', type: 'string' }),
);

function DatasetSearch() {
  return (
    <Provider createStore={() => createStore()}>
      <SearchWrapper uniqueFacets={facets} uniqueFields={tableFields} entityType="dataset" />
    </Provider>
  );
}

export default DatasetSearch;
