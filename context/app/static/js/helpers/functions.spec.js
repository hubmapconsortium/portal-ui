import {
  isEmptyArrayOrObject,
  capitalizeString,
  capitalizeAndReplaceDashes,
  replaceUnderscore,
  getArrayRange,
  getDonorAgeString,
  filterObjectByKeys,
  getOriginSamplesOrgan,
  NOT_CAPITALIZED_WORDS,
  shouldCapitalizeString,
} from './functions';

test('isEmptyArrayOrObject', () => {
  expect(isEmptyArrayOrObject([])).toBeTruthy();
  expect(isEmptyArrayOrObject({})).toBeTruthy();
  expect(isEmptyArrayOrObject(['item'])).toBeFalsy();
  expect(isEmptyArrayOrObject({ key: 'value' })).toBeFalsy();
});

test('capitalizeString', () => {
  expect(capitalizeString('hello')).toEqual('Hello');
  expect(capitalizeString('WORLD')).toEqual('WORLD');
});

test('capitalizeAndReplaceDashes', () => {
  expect(capitalizeAndReplaceDashes('hello-world')).toEqual('Hello World');
  expect(capitalizeAndReplaceDashes('my-new-dog')).toEqual('My New Dog');
  expect(
    capitalizeAndReplaceDashes(
      'a-very-long-string-to-test-capitalization-and-make-sure-the-title-case-works-correctly',
    ),
  ).toEqual('A Very Long String to Test Capitalization and Make Sure the Title Case Works Correctly');
});

test.each(NOT_CAPITALIZED_WORDS, 'capitalizeAndReplaceDashes capitalizes "%s" if it is the first word', (word) => {
  expect(shouldCapitalizeString(word, 0)).toBeTruthy();
  expect(capitalizeAndReplaceDashes(word)).toEqual(capitalizeString(word));
});

test.each(
  NOT_CAPITALIZED_WORDS,
  'capitalizeAndReplaceDashes does not capitalize "%s" if it is not the first word',
  (word) => {
    expect(shouldCapitalizeString(word, 1)).toBeFalsy();
    expect(capitalizeAndReplaceDashes(`first-${word}`)).toEqual(`First ${word}`);
  },
);

test('replaceUnderscore', () => {
  expect(replaceUnderscore('hello_world')).toEqual('hello world');
});

test('getArrayRange', () => {
  expect(getArrayRange(5)).toEqual([0, 1, 2, 3, 4]);
});

test('getDonorAgeString', () => {
  const donor = { age_value: 35, age_unit: 'years' };
  expect(getDonorAgeString(donor)).toEqual('35 years');
});

test('filterObjectByKeys', () => {
  const obj = { key1: 'value1', key2: 'value2', key3: 'value3' };
  const keys = ['key1', 'key3'];
  expect(filterObjectByKeys(obj, keys)).toEqual({ key1: 'value1', key3: 'value3' });
});

test('getOriginSamplesOrgan', () => {
  const entity = { origin_samples_unique_mapped_organs: ['heart'] };
  expect(getOriginSamplesOrgan(entity)).toEqual('heart');
  entity.origin_samples_unique_mapped_organs = ['heart', 'liver'];
  expect(getOriginSamplesOrgan(entity)).toEqual('heart, liver');
  entity.origin_samples_unique_mapped_organs = [];
  expect(getOriginSamplesOrgan(entity)).toEqual('');
});
