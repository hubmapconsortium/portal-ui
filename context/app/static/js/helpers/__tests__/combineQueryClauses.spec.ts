import { combineQueryClauses } from '../functions';

test('should combine query clauses', () => {
  const queries = ['query-1', 'query-2', 'query-3'];
  expect(combineQueryClauses(queries)).toStrictEqual({
    bool: {
      must: queries,
    },
  });
});

test('should exclude empty clauses', () => {
  const queries = ['query-1', null, undefined, 'query-4', false];
  expect(combineQueryClauses(queries)).toStrictEqual({
    bool: {
      must: ['query-1', 'query-4'],
    },
  });
});

test('should exclude empty objects', () => {
  const queries = ['query-1', {}, { key: 'value' }, { another: 'clause' }, { empty: {} }];
  expect(combineQueryClauses(queries)).toStrictEqual({
    bool: {
      must: ['query-1', { key: 'value' }, { another: 'clause' }],
    },
  });
});
