import React from 'react';

import SearchWrapper from 'js/components/entity-search/SearchWrapper';
import { createDatasetFacet, createField } from 'js/components/entity-search/SearchWrapper/utils';

function SampleSearch() {
  return (
    <SearchWrapper
      uniqueFacets={[
        createDatasetFacet({ fieldName: 'origin_sample.mapped_organ', label: 'Organ', type: 'string' }),
        createDatasetFacet({ fieldName: 'mapped_specimen_type', label: 'Specimen Type', type: 'string' }),
      ]}
      uniqueFields={[
        createField({ fieldName: 'origin_sample.mapped_organ', label: 'Organ', type: 'string' }),
        createField({ fieldName: 'mapped_specimen_type', label: 'Specimen Type', type: 'string' }),
      ]}
      entityType="sample"
    />
  );
}

export default SampleSearch;
