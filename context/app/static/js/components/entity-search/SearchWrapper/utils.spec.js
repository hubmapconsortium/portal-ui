import {
  appendKeywordToFieldName,
  prependMetadataPathToFieldName,
  buildFieldConfig,
  buildMetadataFieldConfig,
  createField,
  createFacet,
  mergeObjects,
} from './utils';

test('appendKeywordToFieldName should append .keyword if type is string', () => {
  expect(appendKeywordToFieldName({ field: 'animal', type: 'string' })).toBe('animal.keyword');
});

test('appendKeywordToFieldName should not append .keyword for non-string types', () => {
  expect(appendKeywordToFieldName({ field: 'animal', type: 'number' })).toBe('animal');
});

test('prependMetadataPathToFieldName should return the field unaltered if the path for the entity the field belongs to is not defined', () => {
  expect(prependMetadataPathToFieldName({ field: 'animal', entityType: 'dataset' })).toBe('animal');
});

test('prependMetadataPathToFieldName should return the correct path for donor metadata in samples', () => {
  expect(prependMetadataPathToFieldName({ field: 'age_value', entityType: 'sample' })).toBe(
    'donor.mapped_metadata.age_value',
  );
});

test('prependMetadataPathToFieldName should return the correct path for donor metadata in datasets', () => {
  expect(prependMetadataPathToFieldName({ field: 'age_value', entityType: 'dataset' })).toBe(
    'donor.mapped_metadata.age_value',
  );
});

test('prependMetadataPathToFieldName should return the correct path for sample metadata in datasets', () => {
  expect(prependMetadataPathToFieldName({ field: 'health_status', entityType: 'dataset' })).toBe(
    'source_sample.metadata.health_status',
  );
});

test('prependMetadataPathToFieldName should return the correct path for dataset metadata in datasets', () => {
  expect(prependMetadataPathToFieldName({ field: 'assay_category', entityType: 'dataset' })).toBe(
    'metadata.metadata.assay_category',
  );
});

test('buildFieldConfig should build field config', () => {
  expect(buildFieldConfig({ field: 'animal', label: 'Animal', type: 'string' })).toEqual({
    animal: {
      field: 'animal.keyword',
      identifier: 'animal',
      label: 'Animal',
      type: 'string',
    },
  });
});

test('buildMetadataFieldConfig should build metadata field config', () => {
  expect(buildMetadataFieldConfig({ field: 'assay_category', entityType: 'dataset', label: 'Assay Category' })).toEqual(
    {
      'metadata.metadata.assay_category': {
        field: 'metadata.metadata.assay_category.keyword',
        identifier: 'metadata.metadata.assay_category',
        label: 'Assay Category',
        type: 'string',
      },
    },
  );
});

test('createField should create a non-metadata field config if the field does not exist in metadata field types', () => {
  expect(createField({ field: 'animal', label: 'Animal', type: 'string' })).toEqual({
    animal: {
      field: 'animal.keyword',
      identifier: 'animal',
      label: 'Animal',
      type: 'string',
    },
  });
});

test('createField should create a metadata field config if the field exists in metadata field types', () => {
  expect(createField({ field: 'assay_category', entityType: 'dataset', label: 'Assay Category' })).toEqual({
    'metadata.metadata.assay_category': {
      field: 'metadata.metadata.assay_category.keyword',
      identifier: 'metadata.metadata.assay_category',
      label: 'Assay Category',
      type: 'string',
    },
  });
});

test('createFacet should create a field with default "Additional Facets" facet group', () => {
  expect(createFacet({ field: 'animal', label: 'Animal', type: 'string' })).toEqual({
    animal: {
      field: 'animal.keyword',
      identifier: 'animal',
      label: 'Animal',
      type: 'string',
      facetGroup: 'Additional Facets',
    },
  });
});

test('createFacet should create a field with facet group if specified', () => {
  expect(createFacet({ field: 'animal', label: 'Animal', type: 'string', facetGroup: 'main' })).toEqual({
    animal: {
      field: 'animal.keyword',
      identifier: 'animal',
      label: 'Animal',
      type: 'string',
      facetGroup: 'main',
    },
  });
});

test('should merge objects with unique keys', () => {
  expect(mergeObjects([{ a: 1, b: 2 }, { c: 3 }])).toEqual({ a: 1, b: 2, c: 3 });
});
