import { filterObjectByKeys } from 'js/helpers/functions';

test('should return object with only entries for specified keys', () => {
  const o = { a: 1, b: 2, c: 3 };
  expect(filterObjectByKeys(o, ['a', 'c'])).toEqual({ a: 1, c: 3 });
});
