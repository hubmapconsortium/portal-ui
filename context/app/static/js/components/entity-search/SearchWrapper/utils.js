import { RefinementSelectFacet } from '@searchkit/sdk';

function getDonorMetadataFilters(isDonor) {
  const pathPrefix = isDonor ? '' : 'donor.';
  const labelPrefix = isDonor ? '' : 'Donor ';

  return [
    {
      field: `${pathPrefix}mapped_metadata.sex`,
      label: `${labelPrefix}Sex`,
    },
    {
      field: `${pathPrefix}mapped_metadata.race`,
      label: `${labelPrefix}Race`,
    },
  ];
}

function createFacet({ field, label, ...rest }) {
  return new RefinementSelectFacet({
    field: `${field}.keyword`,
    identifier: field,
    label,
    multipleSelect: true,
    ...rest,
  });
}

export { getDonorMetadataFilters, createFacet };

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
