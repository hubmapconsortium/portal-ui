import { facetTypes } from './facetTypes';

function getFacetProps({ field, label, ...rest }) {
  return {
    field,
    identifier: field,
    label,
    ...rest,
  };
}

function getFieldProps({ field, label }) {
  return {
    field,
    label,
  };
}

function getDonorMetadataFilters(isDonor) {
  const pathPrefix = isDonor ? '' : 'donor.';
  const labelPrefix = isDonor ? '' : 'Donor ';

  return [
    {
      field: `${pathPrefix}mapped_metadata.sex`,
      label: `${labelPrefix}Sex`,
      type: facetTypes.refinementSelectFacet,
    },
    {
      field: `${pathPrefix}mapped_metadata.race`,
      title: `${labelPrefix}Race`,
      type: facetTypes.refinementSelectFacet,
    },
  ];
}

export { getFieldProps, getFacetProps, getDonorMetadataFilters };

/* 
    const bmiField = 'body_mass_index_value';
    const ageField = 'age_value';
    {
      field: `${pathPrefix}mapped_metadata.${ageField}`,
      label: `${labelPrefix}Age`,
      type: FILTER_TYPES.rangeSlider,
      range: { start: 1, end: 100 },
    },
    {
      field: `${pathPrefix}mapped_metadata.${bmiField}`,
      title: `${labelPrefix}BMI`,
      type: FILTER_TYPES.rangeSlider,
      range: { start: 1, end: 50 },
    },
*/
