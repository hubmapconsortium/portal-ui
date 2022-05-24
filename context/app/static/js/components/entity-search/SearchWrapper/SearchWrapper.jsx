import React from 'react';
import { SearchkitClient, SearchkitProvider } from '@searchkit/client';
import { TermFilter } from '@searchkit/sdk';

import Search from 'js/components/entity-search/Search';
import { capitalizeString } from 'js/helpers/functions';
import { mergeObjects, getDonorMetadataFields, createAffiliationFacet, createField } from './utils';
import SearchConfigProvider from './provider';
import { useNumericFacetsProps } from './hooks';

const skClient = new SearchkitClient({
  itemsPerPage: 18,
});

function SearchWrapper({ uniqueFacets, uniqueFields, entityType }) {
  const initialFacets = mergeObjects([
    ...uniqueFacets,
    ...getDonorMetadataFields(entityType),
    createAffiliationFacet({ fieldName: 'group_name', label: 'Group', type: 'string' }),
    createAffiliationFacet({ fieldName: 'created_by_user_displayname', label: 'Creator', type: 'string' }),
  ]);

  const initialFields = mergeObjects([
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

  const numericFacetsProps = useNumericFacetsProps(entityType);
  return (
    Object.keys(numericFacetsProps).length > 0 && (
      <SearchConfigProvider
        initialConfig={{
          initialFacets,
          initialFields,
          facets: initialFacets,
          fields: initialFields,
          filters,
          entityType,
          numericFacetsProps,
        }}
      >
        <SearchkitProvider client={skClient}>
          <Search numericFacetsProps={numericFacetsProps} />
        </SearchkitProvider>
      </SearchConfigProvider>
    )
  );
}

export default SearchWrapper;
