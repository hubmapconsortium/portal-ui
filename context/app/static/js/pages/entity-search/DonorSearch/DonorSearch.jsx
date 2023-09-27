import React from 'react';

import SearchWrapper from 'js/components/entity-search/SearchWrapper';
import { buildDonorFields } from 'js/components/entity-search/SearchWrapper/utils';
import Search from 'js/components/entity-search/Search';

const entityType = 'donor';
const { tableFields } = buildDonorFields(entityType);

function DonorSearch() {
  return (
    <SearchWrapper uniqueFacets={{}} uniqueFields={tableFields} entityType={entityType}>
      <Search />
    </SearchWrapper>
  );
}

export default DonorSearch;
