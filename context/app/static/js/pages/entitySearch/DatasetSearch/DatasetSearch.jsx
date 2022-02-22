import React from 'react';

import { FILTER_TYPES } from 'js/components/entitySearch/filters/Filter/enums';

import EntitySearchWrapper from 'js/components/entitySearch/EntitySearchWrapper';

function DatasetSearch() {
  return (
    <EntitySearchWrapper
      uniqueFilters={[
        { field: 'mapped_data_types', title: 'Data Type', type: FILTER_TYPES.multiList },
        { field: 'origin_sample.mapped_organ', title: 'Organ', type: FILTER_TYPES.multiList },
        { field: 'source_sample.mapped_specimen_type', title: 'Specimen Type', type: FILTER_TYPES.multiList },
        { field: 'mapped_consortium', title: 'Consortium', type: FILTER_TYPES.multiList },
        { field: 'mapped_status', title: 'Status', type: FILTER_TYPES.multiList },
        { field: 'mapped_data_access_level', title: 'Access Level', type: FILTER_TYPES.multiList },
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
