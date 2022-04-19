import { RefinementSelectFacet } from '@searchkit/sdk';
import metadataFieldTypes from 'metadata-field-types';
import metadataFieldEntities from 'metadata-field-entities';

function buildElasticSearchField({ field, type }) {
  if (type === 'string') {
    return `${field}.keyword`;
  }

  return field;
}

function getMetadataFieldWithPath({ field, entityType }) {
  if (entityType === 'donor') return field;

  const fieldEntity = metadataFieldEntities[field];

  const donorMetadataPath = 'donor.mapped_metadata';
  const paths = {
    sample: {
      donor: donorMetadataPath,
    },
    dataset: {
      donor: donorMetadataPath,
      sample: 'source_sample.metadata',
      dataset: 'metadata.metadata',
    },
  };
  return `${paths[entityType][fieldEntity]}.${field}`;
}

function buildFieldConfig({ field, label, type, ...rest }) {
  const elasticsearchField = buildElasticSearchField({ field, type });
  return { [field]: { field: elasticsearchField, identifier: field, label, ...rest } };
}

function buildMetadataFieldConfig({ field, entityType, ...rest }) {
  const elasticsearchType = metadataFieldTypes[field];
  return buildFieldConfig({
    field: getMetadataFieldWithPath({ field, entityType }),
    type: elasticsearchType,
    ...rest,
  });
}

function createField(o) {
  const { field } = o;
  if (field in metadataFieldTypes) {
    return buildMetadataFieldConfig(o);
  }

  return buildFieldConfig(o);
}

const withFacetGroup = (facetGroup) => (o) =>
  createField({
    ...o,
    facetGroup,
  });

function createFacet({ facetGroup = 'Additional Facets', ...rest }) {
  return withFacetGroup(facetGroup)({ ...rest });
}

const createDonorFacet = withFacetGroup('Donor Metadata');
const createDatasetFacet = withFacetGroup('Dataset Metadata');
const createAffiliationFacet = withFacetGroup('Affiliation');

function mergeObjects(objects) {
  return objects.reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

function getDonorMetadataFilters(isDonor) {
  const labelPrefix = isDonor ? '' : 'Donor ';

  return [
    createDonorFacet({
      field: 'sex',
      label: `${labelPrefix}Sex`,
      entityType: 'dataset',
    }),
    createDonorFacet({
      field: 'race',
      label: `${labelPrefix}Race`,
      entityType: 'dataset',
    }),
  ];
}

function createSearchkitFacet({ field, identifier, label, ...rest }) {
  return new RefinementSelectFacet({
    field,
    identifier,
    label,
    multipleSelect: true,
    ...rest,
  });
}

export {
  mergeObjects,
  getDonorMetadataFilters,
  createDonorFacet,
  createDatasetFacet,
  createAffiliationFacet,
  createSearchkitFacet,
  createFacet,
  createField,
};

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
