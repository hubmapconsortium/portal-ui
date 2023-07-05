import { RangeFacet, TermFilter } from '@searchkit/sdk';

import metadataFieldtoTypeMap from 'metadata-field-types';
import metadataFieldtoEntityMap from 'metadata-field-entities';
import { capitalizeString } from 'js/helpers/functions';
import { paths } from 'js/components/entity-search/SearchWrapper/metadataDocumentPaths';
import RefinementSelectFacet from 'js/components/entity-search/searchkit-modifications/RefinementSelectFacet';

// appends '.keyword' to field name for elasticsearch string fields
function appendKeywordToFieldName({ fieldName, type }) {
  if (['string', 'boolean'].includes(type)) {
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
  entityType: _pageEntityType,
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
    ingestValidationToolsName: fieldName,
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
const createSampleFacet = withFacetGroup('Sample Metadata');
const createAffiliationFacet = withFacetGroup('Affiliation');

function mergeObjects(objects) {
  return objects.reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

function buildDonorFields(entityType) {
  const tileFields = {
    ...createDonorFacet({
      fieldName: 'sex',
      entityType,
    }),
    ...createDonorFacet({
      fieldName: 'age_value',
      entityType,
    }),
    ...createDonorFacet({
      fieldName: 'race',
      entityType,
    }),
    ...createDonorFacet({
      fieldName: 'body_mass_index_value',
      entityType,
    }),
  };
  return { tableFields: tileFields, tileFields };
}

function buildDatasetFields() {
  const tileFields = {
    ...createDatasetFacet({ fieldName: 'mapped_data_types', label: 'Data Types', type: 'string' }),
    ...createDatasetFacet({ fieldName: 'origin_samples.mapped_organ', label: 'Organ', type: 'string' }),
  };
  const tableFields = {
    ...tileFields,
    ...createDatasetFacet({ fieldName: 'mapped_status', label: 'Status', type: 'string' }),
  };
  return { tableFields, tileFields };
}

function buildSampleFields() {
  const tileFields = {
    ...createSampleFacet({ fieldName: 'origin_samples.mapped_organ', label: 'Organ', type: 'string' }),
    ...createSampleFacet({ fieldName: 'sample_category', label: 'Sample Category', type: 'string' }),
  };

  return { tableFields: tileFields, tileFields };
}

function buildTileFields(entityType) {
  const entityTypeToBuildFnMap = {
    donor: buildDonorFields,
    sample: buildSampleFields,
    dataset: buildDatasetFields,
  };

  const { tileFields: entityTypeSpecificFields } = entityTypeToBuildFnMap[entityType]();

  return Object.assign(
    createField({ fieldName: 'hubmap_id', label: 'HuBMAP ID', type: 'string' }),
    createField({ fieldName: 'entity_type', label: 'Entity Type', type: 'string' }),
    createField({ fieldName: 'last_modified_timestamp', label: 'Last Modified Timestamp', type: 'number' }),
    createField({ fieldName: 'descendant_counts.entity_type', label: 'Descendant Counts' }),
    entityTypeSpecificFields,
  );
}

function getFieldConfigValue(fieldConfig) {
  // createField returns an object with only a single value.
  return Object.values(fieldConfig)[0];
}

function getTypeFilter({ fieldName, value, ...rest }) {
  const { field, identifier, label } = getFieldConfigValue(createField({ fieldName, ...rest }));

  // TermFilter id as determined by searchkit.
  // https://github.com/searchkit/searchkit/blob/next/packages/searchkit-sdk/src/filters/TermFilter.ts
  const id = `${identifier}_${value}`;
  return {
    [id]: {
      definition: new TermFilter({
        identifier,
        field,
        label,
      }),
      value: { identifier, value },
    },
  };
}

function getEntityTypeFilter(entityType) {
  return getTypeFilter({
    fieldName: 'entity_type',
    label: 'Entity Type',
    type: 'string',
    value: capitalizeString(entityType),
  });
}

const typeToSearchKitFacetMap = {
  integer: RangeFacet,
  number: RangeFacet,
  string: RefinementSelectFacet,
  boolean: RefinementSelectFacet,
};

const defaultSelectFacetSize = 5;

function createSearchkitFacet({ field, identifier, label, type, ...rest }) {
  const Facet = typeToSearchKitFacetMap[type];

  return new Facet({
    field,
    identifier,
    label,
    type,
    // multipleSelect and size props only affect RefinementSelectFacets.
    multipleSelect: true,
    size: defaultSelectFacetSize,
    ...rest,
  });
}

export {
  appendKeywordToFieldName,
  prependMetadataPathToFieldName,
  buildFieldConfig,
  buildMetadataFieldConfig,
  mergeObjects,
  buildDonorFields,
  buildDatasetFields,
  buildSampleFields,
  createDonorFacet,
  createDatasetFacet,
  createAffiliationFacet,
  createSearchkitFacet,
  createField,
  getFieldConfigValue,
  getTypeFilter,
  getEntityTypeFilter,
  buildTileFields,
  defaultSelectFacetSize,
};
