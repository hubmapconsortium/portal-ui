import React from 'react';
import SearchConfigProvider from 'js/pages/entitySearch/searchConfig/provider';
import EntitySearch from 'js/components/entitySearch/EntitySearch';
import { getFieldProps, getFilterProps } from 'js/pages/entitySearch/utils';
import { FILTER_TYPES } from 'js/components/entitySearch/filters/Filter/enums';

const filters = [
  ['mapped_data_types', 'Data Type', FILTER_TYPES.multiList],
  ['origin_sample.mapped_organ', 'Organ', FILTER_TYPES.multiList],
  ['source_sample.mapped_specimen_type', 'Specimen Type', FILTER_TYPES.multiList],
  ['mapped_consortium', 'Consortium', FILTER_TYPES.multiList],
  ['mapped_status', 'Status', FILTER_TYPES.multiList],
  ['mapped_data_access_level', 'Access Level', FILTER_TYPES.multiList],
].map(([field, title, filterType]) => getFilterProps({ field, title, filterType }));

const fields = [
  ['hubmap_id', 'HuBMAP ID'],
  ['group_name', 'Group'],
  ['mapped_data_types', 'Data Types'],
  ['origin_sample.mapped_organ', 'Organ'],
  ['mapped_status', 'Status'],
  ['mapped_last_modified_timestamp', 'Last Modified'],
].map(([field, title]) => getFieldProps({ field, title }));

const config = { filters, fields };

function DatasetSearch() {
  return (
    <SearchConfigProvider initialConfig={config}>
      <EntitySearch />
    </SearchConfigProvider>
  );
}

export default DatasetSearch;
