import React from 'react';

import SearchWrapper from 'js/components/entity-search/SearchWrapper';
import { getDatasetFacet } from 'js/components/entity-search/SearchWrapper/utils';

function DatasetSearch() {
  return (
    <SearchWrapper
      uniqueFacets={[
        getDatasetFacet({ field: 'mapped_data_types', label: 'Data Type' }),
        getDatasetFacet({ field: 'origin_sample.mapped_organ', label: 'Organ' }),
        getDatasetFacet({ field: 'source_sample.mapped_specimen_type', label: 'Specimen Type' }),
        getDatasetFacet({ field: 'mapped_consortium', label: 'Consortium' }),
        getDatasetFacet({ field: 'mapped_status', label: 'Status' }),
        getDatasetFacet({ field: 'mapped_data_access_level', label: 'Access Level' }),
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
