import { getArrayRange } from '../functions';

test('should return an array from 0 to n - 1', () => {
  expect(getArrayRange(5)).toEqual([0, 1, 2, 3, 4]);
});
