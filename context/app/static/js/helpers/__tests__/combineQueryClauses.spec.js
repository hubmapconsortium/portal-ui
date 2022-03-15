const { combineQueryClauses } = require('../functions');

test('should combine query clauses', () => {
  const queries = [
    {
      bool: {
        must_not: {
          term: {
            'fruit.keyword': 'apple',
          },
        },
      },
    },
    {
      bool: {
        must: {
          term: {
            'color.keyword': 'yellow',
          },
        },
      },
    },
  ];
  expect(combineQueryClauses(queries)).toStrictEqual({
    bool: {
      must: queries,
    },
  });
});
