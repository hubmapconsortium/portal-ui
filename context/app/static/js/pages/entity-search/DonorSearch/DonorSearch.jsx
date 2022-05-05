import React from 'react';

import SearchWrapper from 'js/components/entity-search/SearchWrapper';
import { getDonorMetadataFields } from 'js/components/entity-search/SearchWrapper/utils';

function DonorSearch() {
  const entityType = 'donor';
  return <SearchWrapper uniqueFacets={[]} uniqueFields={getDonorMetadataFields(entityType)} entityType={entityType} />;
}

export default DonorSearch;
