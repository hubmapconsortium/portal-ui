import React from 'react';

import { FILTER_TYPES } from 'js/components/entitySearch/filters/Filter/enums';
import EntitySearchWrapper from 'js/components/entitySearch/EntitySearchWrapper';

function SampleSearch() {
  return (
    <EntitySearchWrapper
      uniqueFilters={[
        { field: 'origin_sample.mapped_organ', title: 'Organ', type: FILTER_TYPES.multiList },
        { field: 'mapped_specimen_type', title: 'Specimen Type', type: FILTER_TYPES.multiList },
      ]}
      uniqueFields={[
        ['mapped_specimen_type', 'Specimen Type'],
        ['origin_sample.mapped_organ', 'Organ'],
      ]}
      entityTypeKeyword="Sample"
    />
  );
}

export default SampleSearch;
