import React from 'react';

import { facetTypes } from 'js/components/entity-search/SearchWrapper/facetTypes';

import SearchWrapper from 'js/components/entity-search/SearchWrapper';

function DatasetSearch() {
  return (
    <SearchWrapper
      uniqueFacets={[
        { field: 'mapped_data_types', label: 'Data Type', type: facetTypes.multiList },
        { field: 'origin_sample.mapped_organ', label: 'Organ', type: facetTypes.multiList },
        { field: 'source_sample.mapped_specimen_type', label: 'Specimen Type', type: facetTypes.multiList },
        { field: 'mapped_consortium', label: 'Consortium', type: facetTypes.multiList },
        { field: 'mapped_status', label: 'Status', type: facetTypes.multiList },
        { field: 'mapped_data_access_level', label: 'Access Level', type: facetTypes.multiList },
      ]}
      uniqueFields={[
        ['mapped_data_types', 'Data Types'],
        ['origin_sample.mapped_organ', 'Organ'],
        ['mapped_status', 'Status'],
      ]}
      entityTypeKeyword="Dataset"
    />
  );
}

export default DatasetSearch;
