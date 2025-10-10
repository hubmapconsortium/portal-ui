import { getIDsQuery } from '../queries';

test('should return a query to match correct IDs', () => {
  expect(getIDsQuery(['abc', '123'])).toEqual({
    ids: {
      values: ['abc', '123'],
    },
  });
});
