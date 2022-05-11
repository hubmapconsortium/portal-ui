import React from 'react';

import ConfigureSearchTable from 'js/components/entity-search/sidebar/ConfigureSearchTable';
import { useDonorSampleMetadatFieldConfigs } from './hooks';

function DonorSampleConfigureSearchTable(props) {
  const metadataFields = useDonorSampleMetadatFieldConfigs();

  return <ConfigureSearchTable {...props} availableFields={metadataFields} />;
}

export default DonorSampleConfigureSearchTable;
