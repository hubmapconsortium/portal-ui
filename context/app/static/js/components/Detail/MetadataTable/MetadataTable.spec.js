/* eslint-disable import/no-unresolved */

import { tableDataToRows } from './MetadataTable';

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
