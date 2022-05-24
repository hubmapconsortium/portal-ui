import { RefinementSelectFacet, RangeFacet } from '@searchkit/sdk';

import metadataFieldtoTypeMap from 'metadata-field-types';
import metadataFieldtoEntityMap from 'metadata-field-entities';
import { capitalizeString } from 'js/helpers/functions';
import { paths } from 'js/components/entity-search/SearchWrapper/metadataDocumentPaths';

// appends '.keyword' to field name for elasticsearch string fields
function appendKeywordToFieldName({ fieldName, type }) {
  if (type === 'string') {
    return `${fieldName}.keyword`;
  }

  return fieldName;
}

// gets elasticsearch document path to metadata fields for related entities given an entity type
function prependMetadataPathToFieldName({ fieldName, pageEntityType }) {
  // get entity type from ingest-validation-types document which maps fields to their entity type
  const fieldEntityType = metadataFieldtoEntityMap?.[fieldName];
  const prefix = paths?.[pageEntityType]?.[fieldEntityType];
  if (prefix) {
    return `${prefix}.${fieldName}`;
  }

  return fieldName;
}

function prependEntityTypeToFieldName({ fieldName, pageEntityType }) {
  // Prepends entity type to field name for fields that belong to other entities
  const fieldEntityType = metadataFieldtoEntityMap[fieldName];
  if (pageEntityType !== fieldEntityType) return `${fieldEntityType}.${fieldName}`;

  return fieldName;
}

// builds field config needed for searchkit
function buildFieldConfig({
  fieldName,
  label,
  type,
  facetGroup = 'Additional Facets',
  configureGroup = 'General',
  entityType: pageEntityType,
  ...rest
}) {
  const elasticsearchFieldName = appendKeywordToFieldName({ fieldName, type });
  return {
    [fieldName]: {
      field: elasticsearchFieldName,
      identifier: fieldName,
      label,
      type,
      facetGroup,
      configureGroup,
      ...rest,
    },
  };
}

// builds field config for metadata fields for searchkit
function buildMetadataFieldConfig({ fieldName, entityType: pageEntityType, ...rest }) {
  // get type from ingest-validation-types document which maps fields to their type
  const elasticsearchType = metadataFieldtoTypeMap[fieldName];
  const fieldEntityType = metadataFieldtoEntityMap[fieldName];

  const group = `${capitalizeString(fieldEntityType)} Metadata`;

  return buildFieldConfig({
    fieldName: prependMetadataPathToFieldName({ fieldName, pageEntityType }),
    label: prependEntityTypeToFieldName({ fieldName, pageEntityType }),
    type: elasticsearchType,
    facetGroup: group,
    configureGroup: group,
    entityType: pageEntityType,
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

const createDonorFacet = withFacetGroup('Donor Metadata');
const createDatasetFacet = withFacetGroup('Dataset Metadata');
const createAffiliationFacet = withFacetGroup('Affiliation');

function mergeObjects(objects) {
  return objects.reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

function getDonorMetadataFields(entityType) {
  return [
    createDonorFacet({
      fieldName: 'sex',
      entityType,
    }),
    createDonorFacet({
      fieldName: 'age_value',
      entityType,
    }),
    createDonorFacet({
      fieldName: 'race',
      entityType,
    }),
    createDonorFacet({
      fieldName: 'body_mass_index_value',
      entityType,
    }),
  ];
}

const typeToSearchKitFacetMap = {
  integer: RangeFacet,
  number: RangeFacet,
  string: RefinementSelectFacet,
};

function createSearchkitFacet({ field, identifier, label, type, ...rest }) {
  const Facet = typeToSearchKitFacetMap[type];

  return new Facet({
    field,
    identifier,
    label,
    type,
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
  createField,
};
