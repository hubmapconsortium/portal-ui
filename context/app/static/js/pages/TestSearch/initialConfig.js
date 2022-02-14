const FILTER_TYPES = {
  multiList: 'multiList',
};

function getFilterProps({ field, title, filterType }) {
  return {
    componentId: `${field}-filter`,
    dataField: `${field}.keyword`,
    title,
    filterType,
  };
}

function getFieldProps({ field, title }) {
  return {
    field,
    title,
  };
}

const initialDatasetFilters = [
  ['mapped_data_types', 'Data Type', FILTER_TYPES.multiList],
  ['origin_sample.mapped_organ', 'Organ', FILTER_TYPES.multiList],
  ['source_sample.mapped_specimen_type', 'Specimen Type', FILTER_TYPES.multiList],
  ['mapped_consortium', 'Consortium', FILTER_TYPES.multiList],
  ['mapped_status', 'Status', FILTER_TYPES.multiList],
  ['mapped_data_access_level', 'Access Level', FILTER_TYPES.multiList],
].map(([field, title, filterType]) => getFilterProps({ field, title, filterType }));

const initialDatasetFields = [
  ['hubmap_id', 'HuBMAP ID'],
  ['group_name', 'Group'],
  ['mapped_data_types', 'Data Types'],
  ['origin_sample.mapped_organ', 'Organ'],
  ['mapped_status', 'Status'],
  ['mapped_last_modified_timestamp', 'Last Modified'],
].map(([field, title]) => getFieldProps({ field, title }));

export { initialDatasetFilters, initialDatasetFields, FILTER_TYPES };
