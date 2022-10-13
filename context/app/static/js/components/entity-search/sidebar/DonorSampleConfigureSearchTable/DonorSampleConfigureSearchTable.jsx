import React from 'react';

import ConfigureSearchTableWrapper from 'js/components/entity-search/sidebar/ConfigureSearchTableWrapper';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';

function DonorSampleConfigureSearchTable(props) {
  const { availableFields } = useStore();

  return <ConfigureSearchTableWrapper {...props} availableFields={availableFields} />;
}

export default DonorSampleConfigureSearchTable;
