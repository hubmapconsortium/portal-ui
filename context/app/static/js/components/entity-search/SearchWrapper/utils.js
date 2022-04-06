import { RefinementSelectFacet } from '@searchkit/sdk';

function getFacetWithGroup(facetGroup = 'Additional Facets') {
  return function getFacet({ field, label }) {
    return { [field]: { field, label, facetGroup } };
  };
}

const getDonorFacet = getFacetWithGroup('Donor Metadata');
const getDatasetFacet = getFacetWithGroup('Dataset Metadata');
const getAffiliationFacet = getFacetWithGroup('Affiliation');

function getDonorMetadataFilters(isDonor) {
  const pathPrefix = isDonor ? '' : 'donor.';
  const labelPrefix = isDonor ? '' : 'Donor ';

  return [
    getDonorFacet({
      field: `${pathPrefix}mapped_metadata.sex`,
      label: `${labelPrefix}Sex`,
    }),
    getDonorFacet({
      field: `${pathPrefix}mapped_metadata.race`,
      label: `${labelPrefix}Race`,
    }),
  ];
}

function createSearchkitFacet({ field, label, ...rest }) {
  return new RefinementSelectFacet({
    field: `${field}.keyword`,
    identifier: field,
    label,
    multipleSelect: true,
    ...rest,
  });
}

export { getDonorMetadataFilters, getDonorFacet, getDatasetFacet, getAffiliationFacet, createSearchkitFacet };

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
