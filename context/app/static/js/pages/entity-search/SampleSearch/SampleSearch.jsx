import React from 'react';

import SearchWrapper from 'js/components/entity-search/SearchWrapper';
import { buildSampleFields } from 'js/components/entity-search/SearchWrapper/utils';

const { tableFields } = buildSampleFields();

function SampleSearch() {
  return <SearchWrapper uniqueFacets={tableFields} uniqueFields={tableFields} entityType="sample" />;
}

export default SampleSearch;
