import React from 'react';

import SearchWrapper from 'js/components/entity-search/SearchWrapper';

function DatasetSearch() {
  return (
    <SearchWrapper
      uniqueFacets={[
        { field: 'mapped_data_types', label: 'Data Type' },
        { field: 'origin_sample.mapped_organ', label: 'Organ' },
        { field: 'source_sample.mapped_specimen_type', label: 'Specimen Type' },
        { field: 'mapped_consortium', label: 'Consortium' },
        { field: 'mapped_status', label: 'Status' },
        { field: 'mapped_data_access_level', label: 'Access Level' },
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
