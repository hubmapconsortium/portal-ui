import React from 'react';

import { getDefaultFilters } from 'js/components/entity-search/searchkit-modifications/getDefaultFilters';
import { withSelectableTableProvider } from 'js/shared-styles/tables/SelectableTableProvider';
import {
  mergeObjects,
  buildDonorFields,
  createAffiliationFacet,
  createField,
  getEntityTypeFilter,
  buildTileFields,
} from './utils';
import SearchConfigProvider from './store';
import { useNumericFacetsProps } from './hooks';

function SearchWrapper({ uniqueFacets, uniqueFields, entityType, children }) {
  const { tableFields: donorFacets } = buildDonorFields(entityType);

  const initialFacets = {
    ...uniqueFacets,
    ...donorFacets,
    ...createAffiliationFacet({ fieldName: 'group_name', label: 'Group', type: 'string' }),
    ...createAffiliationFacet({ fieldName: 'created_by_user_displayname', label: 'Creator', type: 'string' }),
  };

  const initialFields = {
    ...createField({ fieldName: 'hubmap_id', label: 'HuBMAP ID', type: 'string' }),
    ...createField({ fieldName: 'group_name', label: 'Group', type: 'string' }),
    ...uniqueFields,
    ...createField({ fieldName: 'mapped_last_modified_timestamp', label: 'Last Modified', type: 'string' }),
  };

  const tileFields = buildTileFields(entityType);

  const defaultFilters = mergeObjects([getEntityTypeFilter(entityType), getDefaultFilters()]);

  const numericFacetsProps = useNumericFacetsProps(entityType);

  if (!Object.keys(numericFacetsProps).length) {
    return null;
  }

  return (
    <SearchConfigProvider
      initialConfig={{
        initialFacets,
        initialFields,
        facets: initialFacets,
        fields: initialFields,
        defaultFilters,
        entityType,
        numericFacetsProps,
        initialView: 'table',
        tileFields,
      }}
    >
      {children}
    </SearchConfigProvider>
  );
}

const SearchWrapperWithSelectableTable = withSelectableTableProvider(SearchWrapper);

export default SearchWrapperWithSelectableTable;
