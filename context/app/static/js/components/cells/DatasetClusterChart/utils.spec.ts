import { getOptionLabels, removeUUIDFromOption, addMatchedAndUnmatched } from './utils';

test.each([
  ['UUID-123-xyz', '123-xyz'],
  ['123-UUID-xyz', '123-xyz'],
  ['123-xyz-UUID', '123-xyz'],
  ['123-xyz', '123-xyz'],
])('Removes uuid from string', (option, expected) => {
  expect(removeUUIDFromOption(option, 'UUID')).toEqual(expected);
});

test('should', () => {
  expect(getOptionLabels(['123-UUID-xyz', 'abc-456-UUID'], 'UUID')).toStrictEqual({
    '123-UUID-xyz': '123-xyz',
    'abc-456-UUID': 'abc-456',
  });
});

test('should add matched and unmatched', () => {
  expect(addMatchedAndUnmatched({ matched: 2, unmatched: 3 })).toBe(5);
});
