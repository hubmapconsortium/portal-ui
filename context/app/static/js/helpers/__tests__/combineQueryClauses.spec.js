const { combineQueryClauses } = require('../functions');

test('should combine query clauses', () => {
  const queries = ['query-1', 'query-2', 'query-3'];
  expect(combineQueryClauses(queries)).toStrictEqual({
    bool: {
      must: queries,
    },
  });
});
