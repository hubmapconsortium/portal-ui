import { buildElasticSearchField, mergeObjects } from './utils';

test('buildElasticSearchField should append .keyword if type is string', () => {
  expect(buildElasticSearchField({ field: 'animal', type: 'string' })).toBe('animal.keyword');
});

test('buildElasticSearchField should not append .keyword for non-string types', () => {
  expect(buildElasticSearchField({ field: 'animal', type: 'number' })).toBe('animal');
});

test('should merge objects with unique keys', () => {
  expect(mergeObjects([{ a: 1, b: 2 }, { c: 3 }])).toEqual({ a: 1, b: 2, c: 3 });
});
