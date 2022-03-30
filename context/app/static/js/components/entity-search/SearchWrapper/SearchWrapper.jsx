import React from 'react';
import { SearchkitClient, SearchkitProvider } from '@searchkit/client';

import Search from 'js/components/entity-search/Search';
import { getFieldProps, getFacetProps, getDonorMetadataFilters } from './utils';
import SearchConfigProvider from './provider';
import { facetTypes } from './facetTypes';

const skClient = new SearchkitClient();

function SearchWrapper({ uniqueFacets, uniqueFields, entityTypeKeyword }) {
  const facets = [
    ...uniqueFacets,
    ...getDonorMetadataFilters(entityTypeKeyword === 'Donor'),
    { field: 'group_name', label: 'Group', type: facetTypes.refinementSelectFacet },
    { field: 'created_by_user_displayname', label: 'Creator', type: facetTypes.refinementSelectFacet },
  ].map((filterProps) => getFacetProps(filterProps));

  const fields = [
    ['hubmap_id', 'HuBMAP ID'],
    ['group_name', 'Group'],
    ...uniqueFields,
    ['mapped_last_modified_timestamp', 'Last Modified'],
  ].map(([field, label]) => getFieldProps({ field, label }));

  const config = { facets, fields };

  return (
    <SearchConfigProvider initialConfig={config}>
      <SearchkitProvider client={skClient}>
        <Search />
      </SearchkitProvider>
    </SearchConfigProvider>
  );
}

export default SearchWrapper;
