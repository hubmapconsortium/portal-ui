import React from 'react';
import { SearchkitClient, SearchkitProvider } from '@searchkit/client';
import { TermFilter } from '@searchkit/sdk';

import Search from 'js/components/entity-search/Search';
import { getDonorMetadataFilters, getAffiliationFacet, getField } from './utils';
import SearchConfigProvider from './provider';

const skClient = new SearchkitClient();

function SearchWrapper({ uniqueFacets, uniqueFields, entityTypeKeyword }) {
  const facets = [
    ...uniqueFacets,
    ...getDonorMetadataFilters(entityTypeKeyword === 'Donor'),
    getAffiliationFacet({ field: 'group_name', label: 'Group', type: 'string' }),
    getAffiliationFacet({ field: 'created_by_user_displayname', label: 'Creator', type: 'string' }),
  ].reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const fields = [
    getField({ field: 'hubmap_id', label: 'HuBMAP ID', type: 'string' }),
    getField({ field: 'group_name', label: 'Group', type: 'string' }),
    ...uniqueFields,
    getField({ field: 'mapped_last_modified_timestamp', label: 'Last Modified', type: 'string' }),
  ].reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const filters = [
    {
      definition: new TermFilter({
        identifier: 'entity_type.keyword',
        field: 'entity_type.keyword',
        label: 'Entity Type',
      }),
      value: { identifier: 'entity_type.keyword', value: entityTypeKeyword },
    },
  ];

  const config = { facets, fields, filters };

  return (
    <SearchConfigProvider initialConfig={config}>
      <SearchkitProvider client={skClient}>
        <Search />
      </SearchkitProvider>
    </SearchConfigProvider>
  );
}

export default SearchWrapper;
