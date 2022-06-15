import React from 'react';

import ConfigureSearchTableWrapper from 'js/components/entity-search/sidebar/ConfigureSearchTableWrapper';
import { useDonorSampleMetadatFieldConfigs } from './hooks';

function DonorSampleConfigureSearchTable(props) {
  const metadataFields = useDonorSampleMetadatFieldConfigs();

  return <ConfigureSearchTableWrapper {...props} availableFields={metadataFields} />;
}

export default DonorSampleConfigureSearchTable;
