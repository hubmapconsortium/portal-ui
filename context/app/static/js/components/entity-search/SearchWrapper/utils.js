import { RefinementSelectFacet } from '@searchkit/sdk';
import metadataFieldTypes from 'metadata-field-types';
import metadataFieldEntities from 'metadata-field-entities';

function getElasticsearchField({ field, type }) {
  if (type === 'string') {
    return `${field}.keyword`;
  }

  return field;
}

function addMetadataFieldPath({ field, entityType }) {
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
  const elasticsearchField = getElasticsearchField({ field, type });
  return { [field]: { field: elasticsearchField, identifier: field, label, ...rest } };
}

function buildMetadataFieldConfig({ field, label, entityType, ...rest }) {
  const elasticsearchType = metadataFieldTypes[field];
  return buildFieldConfig({
    field: addMetadataFieldPath({ field, entityType }),
    label,
    type: elasticsearchType,
    ...rest,
  });
}

function getField(entries) {
  const { field } = entries;
  if (field in metadataFieldTypes) {
    return buildMetadataFieldConfig(entries);
  }

  return buildFieldConfig(entries);
}

function getFacetWithGroup(facetGroup = 'Additional Facets') {
  return function getFacet(entries) {
    return getField({ ...entries, facetGroup });
  };
}

const getDonorFacet = getFacetWithGroup('Donor Metadata');
const getDatasetFacet = getFacetWithGroup('Dataset Metadata');
const getAffiliationFacet = getFacetWithGroup('Affiliation');

function getDonorMetadataFilters(isDonor) {
  const labelPrefix = isDonor ? '' : 'Donor ';

  return [
    getDonorFacet({
      field: 'sex',
      label: `${labelPrefix}Sex`,
      entityType: 'dataset',
    }),
    getDonorFacet({
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

export { getDonorMetadataFilters, getDonorFacet, getDatasetFacet, getAffiliationFacet, createSearchkitFacet, getField };

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
