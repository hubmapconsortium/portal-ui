import { FILTER_TYPES } from 'js/components/entitySearch/filters/Filter/enums';

function getFilterProps({ field, type, ...rest }) {
  return {
    componentId: `${field}-filter`,
    dataField: type === FILTER_TYPES.multiList ? `${field}.keyword` : field,
    type,
    ...rest,
  };
}

function getFieldProps({ field, title }) {
  return {
    field,
    title,
  };
}

function getDonorMetadataFilters(isDonor) {
  const bmiField = 'body_mass_index_value';
  const ageField = 'age_value';
  const pathPrefix = isDonor ? '' : 'donor.';
  const labelPrefix = isDonor ? '' : 'Donor ';

  return [
    { field: `${pathPrefix}mapped_metadata.sex`, title: `${labelPrefix}Sex`, type: FILTER_TYPES.multiList },
    {
      field: `${pathPrefix}mapped_metadata.${ageField}`,
      title: `${labelPrefix}Age`,
      type: FILTER_TYPES.rangeSlider,
      range: { start: 1, end: 100 },
    },
    { field: `${pathPrefix}mapped_metadata.race`, title: `${labelPrefix}Race`, type: FILTER_TYPES.multiList },
    {
      field: `${pathPrefix}mapped_metadata.${bmiField}`,
      title: `${labelPrefix}BMI`,
      type: FILTER_TYPES.rangeSlider,
      range: { start: 1, end: 50 },
    },
  ];
}

export { getFieldProps, getFilterProps, getDonorMetadataFilters };
