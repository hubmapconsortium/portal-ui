import React from 'react';

import ConfigureSearchTable from 'js/components/entity-search/sidebar/ConfigureSearchTable';
import { useMetadataFieldConfigs } from './hooks';

function DonorSampleConfigureSearchTable({ selectedFields, handleToggleField }) {
  const metadataFields = useMetadataFieldConfigs();

  return (
    <ConfigureSearchTable
      selectedFields={selectedFields}
      handleToggleField={handleToggleField}
      availableFields={metadataFields}
    />
  );
}

export default DonorSampleConfigureSearchTable;
