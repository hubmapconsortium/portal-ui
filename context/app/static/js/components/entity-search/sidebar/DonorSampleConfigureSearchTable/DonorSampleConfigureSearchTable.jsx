import React from 'react';

import ConfigureSearchTable from 'js/components/entity-search/sidebar/ConfigureSearchTable';
import { useDonorSampleMetadatFieldConfigs } from './hooks';

function DonorSampleConfigureSearchTable({ selectedFields, handleToggleField }) {
  const metadataFields = useDonorSampleMetadatFieldConfigs();

  return (
    <ConfigureSearchTable
      selectedFields={selectedFields}
      handleToggleField={handleToggleField}
      availableFields={metadataFields}
    />
  );
}

export default DonorSampleConfigureSearchTable;
