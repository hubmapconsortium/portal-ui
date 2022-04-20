import {
  buildElasticSearchField,
  getMetadataFieldWithPath,
  buildFieldConfig,
  buildMetadataFieldConfig,
  createField,
  createFacet,
  mergeObjects,
} from './utils';

test('buildElasticSearchField should append .keyword if type is string', () => {
  expect(buildElasticSearchField({ field: 'animal', type: 'string' })).toBe('animal.keyword');
});

test('buildElasticSearchField should not append .keyword for non-string types', () => {
  expect(buildElasticSearchField({ field: 'animal', type: 'number' })).toBe('animal');
});

test('getMetadataFieldWithPath should return the field unaltered if the entity type is not sample or dataset', () => {
  expect(getMetadataFieldWithPath({ field: 'animal', entityType: 'donor' })).toBe('animal');
});

test('getMetadataFieldWithPath should return the field unaltered if the path for the entity the field belongs to is not defined', () => {
  expect(getMetadataFieldWithPath({ field: 'animal', entityType: 'dataset' })).toBe('animal');
});

test('getMetadataFieldWithPath should return the correct path for donor metadata in samples', () => {
  expect(getMetadataFieldWithPath({ field: 'age_value', entityType: 'sample' })).toBe(
    'donor.mapped_metadata.age_value',
  );
});

test('getMetadataFieldWithPath should return the correct path for donor metadata in datasets', () => {
  expect(getMetadataFieldWithPath({ field: 'age_value', entityType: 'dataset' })).toBe(
    'donor.mapped_metadata.age_value',
  );
});

test('getMetadataFieldWithPath should return the correct path for sample metadata in datasets', () => {
  expect(getMetadataFieldWithPath({ field: 'health_status', entityType: 'dataset' })).toBe(
    'source_sample.metadata.health_status',
  );
});

test('getMetadataFieldWithPath should return the correct path for dataset metadata in datasets', () => {
  expect(getMetadataFieldWithPath({ field: 'assay_category', entityType: 'dataset' })).toBe(
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
