import {
  isEmptyArrayOrObject,
  capitalizeString,
  capitalizeAndReplaceDashes,
  replaceUnderscore,
  getArrayRange,
  getDonorAgeString,
  filterObjectByKeys,
  getOriginSamplesOrgan,
} from './functions'; // replace 'yourModule' with your actual module name

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
});

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
  const entity = { origin_samples: [{ mapped_organ: 'heart' }] };
  expect(getOriginSamplesOrgan(entity)).toEqual('heart');
});
