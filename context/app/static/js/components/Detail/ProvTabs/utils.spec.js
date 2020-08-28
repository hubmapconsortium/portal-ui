import { checkDataTypesForValues, getTabIndex } from './utils';

test('returns false when neither values to check are in data types array', () => {
  const dataTypes = ['fake', 'fake2'];
  expect(checkDataTypesForValues(dataTypes, ['snare_lab', 'fake3'])).toBe(false);
});

test('returns true when one of the values to check is in data types array', () => {
  const dataTypes = ['fake', 'fake_snare_lab'];
  expect(checkDataTypesForValues(dataTypes, ['snare_lab'])).toBe(true);
});

test('returns true when both of the values to check is in data types array', () => {
  const dataTypes = ['fake', 'fake_snare_lab'];
  expect(checkDataTypesForValues(dataTypes, ['snare_lab', 'fake'])).toBe(true);
});

test('returns true when one of the values to check is in data types array and cases do not match', () => {
  const dataTypes = ['fake', 'fake_snare_LAB'];
  expect(checkDataTypesForValues(dataTypes, ['SNARE_lab'])).toBe(true);
});

test('returns default index when shouldDisplayTable is true', () => {
  expect(getTabIndex(1, true)).toBe(1);
});

test('returns default index less 1 when shouldDisplayTable is false', () => {
  expect(getTabIndex(1, false)).toBe(0);
});
