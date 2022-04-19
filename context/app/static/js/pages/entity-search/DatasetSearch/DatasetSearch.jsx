import React from 'react';

import SearchWrapper from 'js/components/entity-search/SearchWrapper';
import { createDatasetFacet, createField } from 'js/components/entity-search/SearchWrapper/utils';

function DatasetSearch() {
  return (
    <SearchWrapper
      uniqueFacets={[
        createDatasetFacet({ field: 'mapped_data_types', label: 'Data Type', type: 'string' }),
        createDatasetFacet({ field: 'origin_sample.mapped_organ', label: 'Organ', type: 'string' }),
        createDatasetFacet({ field: 'source_sample.mapped_specimen_type', label: 'Specimen Type', type: 'string' }),
        createDatasetFacet({ field: 'mapped_consortium', label: 'Consortium', type: 'string' }),
        createDatasetFacet({ field: 'mapped_status', label: 'Status', type: 'string' }),
        createDatasetFacet({ field: 'mapped_data_access_level', label: 'Access Level', type: 'string' }),
      ]}
      uniqueFields={[
        createField({ field: 'mapped_data_types', label: 'Data Types', type: 'string' }),
        createField({ field: 'origin_sample.mapped_organ', label: 'Organ', type: 'string' }),
        createField({ field: 'mapped_status', label: 'Status', type: 'string' }),
      ]}
      entityTypeKeyword="Dataset"
    />
  );
}

export default DatasetSearch;
