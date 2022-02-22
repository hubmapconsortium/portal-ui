import React from 'react';

import SearchConfigProvider from 'js/pages/entitySearch/searchConfig/provider';
import EntitySearch from 'js/components/entitySearch/EntitySearch';
import { getFieldProps, getFilterProps, getDonorMetadataFilters } from 'js/pages/entitySearch/utils';
import { FILTER_TYPES } from 'js/components/entitySearch/filters/Filter/enums';
import { addRestrictionsToQuery } from 'js/helpers/functions';

const filters = [
  { field: 'mapped_data_types', title: 'Data Type', type: FILTER_TYPES.multiList },
  { field: 'origin_sample.mapped_organ', title: 'Organ', type: FILTER_TYPES.multiList },
  { field: 'source_sample.mapped_specimen_type', title: 'Specimen Type', type: FILTER_TYPES.multiList },
  { field: 'mapped_consortium', title: 'Consortium', type: FILTER_TYPES.multiList },
  { field: 'mapped_status', title: 'Status', type: FILTER_TYPES.multiList },
  { field: 'mapped_data_access_level', title: 'Access Level', type: FILTER_TYPES.multiList },
  ...getDonorMetadataFilters(false),
  { field: 'group_name', title: 'Group', type: FILTER_TYPES.multiList },
  { field: 'created_by_user_displayname', title: 'Creator', type: FILTER_TYPES.multiList },
].map((filterProps) => getFilterProps(filterProps));

const fields = [
  ['hubmap_id', 'HuBMAP ID'],
  ['group_name', 'Group'],
  ['mapped_data_types', 'Data Types'],
  ['origin_sample.mapped_organ', 'Organ'],
  ['mapped_status', 'Status'],
  ['mapped_last_modified_timestamp', 'Last Modified'],
].map(([field, title]) => getFieldProps({ field, title }));

const config = { filters, fields };

const universalQuery = addRestrictionsToQuery({
  query: {
    term: {
      'entity_type.keyword': 'Dataset',
    },
  },
});

function DatasetSearch() {
  return (
    <SearchConfigProvider initialConfig={config}>
      <EntitySearch universalQuery={universalQuery} />
    </SearchConfigProvider>
  );
}

export default DatasetSearch;
