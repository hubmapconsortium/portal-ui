import React from 'react';

import SearchConfigProvider from 'js/pages/entitySearch/searchConfig/provider';
import EntitySearch from 'js/components/entitySearch/EntitySearch';
import { getFieldProps, getFilterProps, getDonorMetadataFilters } from 'js/pages/entitySearch/utils';
import { FILTER_TYPES } from 'js/components/entitySearch/filters/Filter/enums';
import { addRestrictionsToQuery } from 'js/helpers/functions';

function EntitySearchWrapper({ uniqueFilters, uniqueFields, entityTypeKeyword }) {
  const filters = [
    ...uniqueFilters,
    ...getDonorMetadataFilters(entityTypeKeyword === 'Donor'),
    { field: 'group_name', title: 'Group', type: FILTER_TYPES.multiList },
    { field: 'created_by_user_displayname', title: 'Creator', type: FILTER_TYPES.multiList },
  ].map((filterProps) => getFilterProps(filterProps));

  const fields = [
    ['hubmap_id', 'HuBMAP ID'],
    ['group_name', 'Group'],
    ...uniqueFields,
    ['mapped_last_modified_timestamp', 'Last Modified'],
  ].map(([field, title]) => getFieldProps({ field, title }));

  const config = { filters, fields };

  const universalQuery = addRestrictionsToQuery({
    query: {
      term: {
        'entity_type.keyword': entityTypeKeyword,
      },
    },
  });

  return (
    <SearchConfigProvider initialConfig={config}>
      <EntitySearch universalQuery={universalQuery} />
    </SearchConfigProvider>
  );
}

export default EntitySearchWrapper;
