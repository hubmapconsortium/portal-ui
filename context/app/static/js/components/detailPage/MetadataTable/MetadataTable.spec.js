import { tableDataToRows, getDescription } from './MetadataTable';

test('should handle plain fields', () => {
  // Wouldn't actually expect to see age_value anywhere except for donor,
  // but shouldn't make a difference... and if it does, we want to know.
  expect(getDescription('age_value')).toEqual('The time elapsed since birth.');
});

test('should handle donor fields', () => {
  expect(getDescription('donor.age_value')).toEqual('For the original donor: The time elapsed since birth.');
});

test('should handle sample fields', () => {
  expect(getDescription('sample.age_value')).toEqual('For the original sample: The time elapsed since birth.');
});

test('should return undefined if there is not a definition', () => {
  expect(getDescription('sample.no_such_stem')).toEqual(undefined);
});

test('should error if stem is known, but prefix is not', () => {
  expect(() => getDescription('no_such_prefix.age_value')).toThrow();
});

test('should look up field descriptions', () => {
  expect(
    tableDataToRows({
      assay_type: 'FAKE-seq',
    }),
  ).toEqual([
    {
      description: 'The specific type of assay being executed.',
      key: 'assay_type',
      value: 'FAKE-seq',
    },
  ]);
});

test('should remove nested objects, but concat nested lists', () => {
  expect(
    tableDataToRows({
      object: { foo: 'bar' },
      list: ['foo', 'bar'],
    }),
  ).toEqual([
    {
      description: undefined,
      key: 'list',
      value: 'foo, bar',
    },
  ]);
});

test('should remove keys that are not metadata', () => {
  expect(
    tableDataToRows({
      contributors_path: '/local/path',
      antibodies_path: '/local/path',
      version: '42',
    }),
  ).toEqual([]);
});
