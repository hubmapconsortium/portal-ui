import { formatCount } from './utils';

test('formatCount function should return correct format', () => {
  expect(formatCount(10500)).toEqual('10.5k');
  expect(formatCount(99999)).toEqual('99.9k');
  expect(formatCount(9999)).toEqual(9999);
  expect(formatCount(1234.56)).toEqual(1234.56);
});
