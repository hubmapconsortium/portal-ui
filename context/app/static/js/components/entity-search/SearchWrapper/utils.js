import { RefinementSelectFacet } from '@searchkit/sdk';
import metadataFieldtoTypeMap from 'metadata-field-types';
import metadataFieldtoEntityMap from 'metadata-field-entities';

// appends '.keyword' to field name for elasticsearch string fields
function appendKeywordToFieldName({ fieldName, type }) {
  if (type === 'string') {
    return `${fieldName}.keyword`;
  }

  return fieldName;
}

// gets elasticsearch document path to metadata fields for related entities given an entity type
function prependMetadataPathToFieldName({ fieldName, entityType }) {
  const donorMetadataPath = 'mapped_metadata';
  const sampleMetdataPath = 'metadata';

  const paths = {
    donor: {
      donor: donorMetadataPath,
    },
    sample: {
      sample: sampleMetdataPath,
      donor: `donor.${donorMetadataPath}`,
    },
    dataset: {
      donor: `donor.${donorMetadataPath}`,
      sample: `source_sample.${sampleMetdataPath}`,
      dataset: 'metadata.metadata',
    },
  };

  // get entity type from ingest-validation-types document which maps fields to their entity type
  const fieldEntityType = metadataFieldtoEntityMap?.[fieldName];
  const prefix = paths?.[entityType]?.[fieldEntityType];
  if (prefix) {
    return `${prefix}.${fieldName}`;
  }

  return fieldName;
}

// prepends entity type to field name for fields that belong to other entities
function prependEntityTypeToFieldName({ fieldName, entityType }) {
  const fieldEntityType = metadataFieldtoEntityMap[fieldName];
  if (entityType !== fieldEntityType) return `${fieldEntityType}.${fieldName}`;

  return fieldName;
}

// builds field config needed for searchkit
function buildFieldConfig({ fieldName, label, type, ...rest }) {
  const elasticsearchFieldName = appendKeywordToFieldName({ fieldName, type });
  return { [fieldName]: { field: elasticsearchFieldName, identifier: fieldName, label, type, ...rest } };
}

// builds field config for metadata fields for searchkit
function buildMetadataFieldConfig({ fieldName, entityType, ...rest }) {
  // get type from ingest-validation-types document which maps fields to their type
  const elasticsearchType = metadataFieldtoTypeMap[fieldName];
  return buildFieldConfig({
    fieldName: prependMetadataPathToFieldName({ fieldName, entityType }),
    label: prependEntityTypeToFieldName({ fieldName, entityType }),
    type: elasticsearchType,
    ...rest,
  });
}

function createField(o) {
  const { fieldName } = o;
  if (fieldName in metadataFieldtoTypeMap) {
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

function getDonorMetadataFields(entityType) {
  const labelPrefix = entityType === 'donor' ? '' : 'Donor ';

  return [
    createDonorFacet({
      fieldName: 'sex',
      label: `${labelPrefix}Sex`,
      entityType,
    }),
    createDonorFacet({
      fieldName: 'race',
      label: `${labelPrefix}Race`,
      entityType,
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
  appendKeywordToFieldName,
  prependMetadataPathToFieldName,
  buildFieldConfig,
  buildMetadataFieldConfig,
  mergeObjects,
  getDonorMetadataFields,
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
