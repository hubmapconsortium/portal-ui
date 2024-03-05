import { buildBuckets } from './HierarchicalFacetAccessor';

test('should build buckets', () => {
  const aggregations = [
    { key: 'red', doc_count: 50, other: { buckets: [{ key: 'apple', doc_count: 20 }] } },
    {
      key: 'yellow',
      doc_count: 100,
      other: {
        buckets: [
          { key: 'banana', doc_count: 10 },
          { key: 'lemon', doc_count: 10 },
        ],
      },
    },
    { key: 'blue', doc_count: 0, other: { buckets: [] } },
  ];

  const childField = 'other';

  const selectedState = {
    red: ['strawberry'],
    green: ['kiwi'],
  };

  expect(buildBuckets({ aggregations, childField, selectedState })).toEqual({
    red: {
      key: 'red',
      doc_count: 50,
      other: { buckets: [{ key: 'apple', doc_count: 20 }] },
      buckets: {
        apple: {
          key: 'apple',
          doc_count: 20,
          parentKey: 'red',
        },
        strawberry: {
          key: 'strawberry',
          doc_count: 0,
          parentKey: 'red',
        },
      },
    },
    yellow: {
      key: 'yellow',
      doc_count: 100,
      other: {
        buckets: [
          { key: 'banana', doc_count: 10 },
          { key: 'lemon', doc_count: 10 },
        ],
      },
      buckets: {
        banana: {
          key: 'banana',
          doc_count: 10,
          parentKey: 'yellow',
        },
        lemon: {
          key: 'lemon',
          doc_count: 10,
          parentKey: 'yellow',
        },
      },
    },
    blue: {
      key: 'blue',
      doc_count: 0,
      other: { buckets: [] },
      buckets: {},
    },
    green: {
      key: 'green',
      doc_count: 0,
      buckets: {
        kiwi: {
          key: 'kiwi',
          doc_count: 0,
          parentKey: 'green',
        },
      },
    },
  });
});
