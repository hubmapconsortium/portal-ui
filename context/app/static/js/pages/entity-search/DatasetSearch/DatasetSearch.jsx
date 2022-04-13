import React from 'react';

import SearchWrapper from 'js/components/entity-search/SearchWrapper';
import { getDatasetFacet } from 'js/components/entity-search/SearchWrapper/utils';

function DatasetSearch() {
  return (
    <SearchWrapper
      uniqueFacets={[
        getDatasetFacet({ field: 'mapped_data_types', label: 'Data Type', type: 'string' }),
        getDatasetFacet({ field: 'origin_sample.mapped_organ', label: 'Organ', type: 'string' }),
        getDatasetFacet({ field: 'source_sample.mapped_specimen_type', label: 'Specimen Type', type: 'string' }),
        getDatasetFacet({ field: 'mapped_consortium', label: 'Consortium', type: 'string' }),
        getDatasetFacet({ field: 'mapped_status', label: 'Status', type: 'string' }),
        getDatasetFacet({ field: 'mapped_data_access_level', label: 'Access Level', type: 'string' }),
      ]}
      uniqueFields={[
        { field: 'mapped_data_types', label: 'Data Types' },
        { field: 'origin_sample.mapped_organ', label: 'Organ' },
        { field: 'mapped_status', label: 'Status' },
      ]}
      entityTypeKeyword="Dataset"
    />
  );
}

export default DatasetSearch;
