import { addRestrictionsToQuery } from '../functions';

test('it should return the correct query', () => {
  const baseQuery = {
    query: {
      ids: {
        values: ['2dc0514607ae08af7004d9cb8c9640c9', '72605b56bc5c452a3b6948e4b6b983ed'],
      },
    },
    _source: 'uuid',
  };

  const expectedQuery = {
    query: {
      bool: {
        must: [
          {
            ids: {
              values: ['2dc0514607ae08af7004d9cb8c9640c9', '72605b56bc5c452a3b6948e4b6b983ed'],
            },
          },
          {
            bool: {
              must_not: [
                {
                  exists: {
                    field: 'next_revision_uuid',
                  },
                },
                {
                  exists: {
                    field: 'sub_status',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    _source: 'uuid',
  };

  expect(addRestrictionsToQuery(baseQuery)).toStrictEqual(expectedQuery);
});

test('it should return the correct query when no inner query is provided', () => {
  const baseQuery = {
    size: 0,
    aggs: { entity_type: { terms: { field: 'entity_type.keyword' } } },
  };

  const expectedQuery = {
    query: {
      bool: {
        must: [
          {
            bool: {
              must_not: [
                {
                  exists: {
                    field: 'next_revision_uuid',
                  },
                },
                {
                  exists: {
                    field: 'sub_status',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    size: 0,
    aggs: { entity_type: { terms: { field: 'entity_type.keyword' } } },
  };

  expect(addRestrictionsToQuery(baseQuery)).toStrictEqual(expectedQuery);
});
