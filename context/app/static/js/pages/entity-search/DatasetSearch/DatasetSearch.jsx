import React from 'react';

import SearchWrapper from 'js/components/entity-search/SearchWrapper';
import { createDatasetFacet, buildDatasetFields } from 'js/components/entity-search/SearchWrapper/utils';

const { tableFields } = buildDatasetFields();

const facets = [
  createDatasetFacet({ fieldName: 'mapped_data_types', label: 'Data Type', type: 'string' }),
  createDatasetFacet({ fieldName: 'origin_sample.mapped_organ', label: 'Organ', type: 'string' }),
  createDatasetFacet({ fieldName: 'source_sample.mapped_specimen_type', label: 'Specimen Type', type: 'string' }),
  createDatasetFacet({ fieldName: 'mapped_consortium', label: 'Consortium', type: 'string' }),
  createDatasetFacet({ fieldName: 'mapped_status', label: 'Status', type: 'string' }),
  createDatasetFacet({ fieldName: 'mapped_data_access_level', label: 'Access Level', type: 'string' }),
];

function DatasetSearch() {
  return <SearchWrapper uniqueFacets={facets} uniqueFields={tableFields} entityType="dataset" />;
}

export default DatasetSearch;
