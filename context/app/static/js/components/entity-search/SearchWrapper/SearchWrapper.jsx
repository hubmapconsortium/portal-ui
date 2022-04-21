import React from 'react';
import { SearchkitClient, SearchkitProvider } from '@searchkit/client';
import { TermFilter } from '@searchkit/sdk';

import Search from 'js/components/entity-search/Search';
import { capitalizeString } from 'js/helpers/functions';
import { mergeObjects, getDonorMetadataFilters, createAffiliationFacet, createField } from './utils';
import SearchConfigProvider from './provider';

const skClient = new SearchkitClient();

function SearchWrapper({ uniqueFacets, uniqueFields, entityType }) {
  const facets = mergeObjects([
    ...uniqueFacets,
    ...getDonorMetadataFilters(entityType),
    createAffiliationFacet({ fieldName: 'group_name', label: 'Group', type: 'string' }),
    createAffiliationFacet({ fieldName: 'created_by_user_displayname', label: 'Creator', type: 'string' }),
  ]);

  const fields = mergeObjects([
    createField({ fieldName: 'hubmap_id', label: 'HuBMAP ID', type: 'string' }),
    createField({ fieldName: 'group_name', label: 'Group', type: 'string' }),
    ...uniqueFields,
    createField({ fieldName: 'mapped_last_modified_timestamp', label: 'Last Modified', type: 'string' }),
  ]);

  const filters = [
    {
      definition: new TermFilter({
        identifier: 'entity_type.keyword',
        field: 'entity_type.keyword',
        label: 'Entity Type',
      }),
      value: { identifier: 'entity_type.keyword', value: capitalizeString(entityType) },
    },
  ];

  const config = { facets, fields, filters, entityType };

  return (
    <SearchConfigProvider initialConfig={config}>
      <SearchkitProvider client={skClient}>
        <Search />
      </SearchkitProvider>
    </SearchConfigProvider>
  );
}

export default SearchWrapper;
