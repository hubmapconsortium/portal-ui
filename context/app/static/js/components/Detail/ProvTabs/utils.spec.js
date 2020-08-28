import { checkDataTypesForValues } from './utils';

test('returns false when neither values to check are in data types array', () => {
  const dataTypes = ['fake', 'fake2'];
  expect(checkDataTypesForValues(dataTypes, ['fake_snare_lab', 'fake3'])).toBe(false);
});

test('returns true when one of the values to check is in data types array', () => {
  const dataTypes = ['fake', 'fake_snare_lab'];
  expect(checkDataTypesForValues(dataTypes, ['fake_snare_lab'])).toBe(true);
});

test('returns true when both of the values to check is in data types array', () => {
  const dataTypes = ['fake', 'fake_snare_lab'];
  expect(checkDataTypesForValues(dataTypes, ['fake_snare_lab', 'fake'])).toBe(true);
});
