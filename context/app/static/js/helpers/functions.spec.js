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
  generateCommaList,
  isValidEmail,
  getEntityCreationInfo,
  validateAndFormatOrcidId,
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

test('generateCommaList', () => {
  expect(generateCommaList([])).toStrictEqual('');
  expect(generateCommaList(['apples'])).toStrictEqual('apples');
  expect(generateCommaList(['apples', 'bananas'])).toStrictEqual('apples and bananas');
  expect(generateCommaList(['apples', 'bananas', 'oranges'])).toStrictEqual('apples, bananas, and oranges');
  expect(generateCommaList(['apples', 'bananas', 'oranges', 'grapes'])).toStrictEqual(
    'apples, bananas, oranges, and grapes',
  );
});

const validEmails = [
  'username@gmail.com',
  'u@hotmail.org',
  '   username@gmail.com',
  'username@gmail.com        ',
  ' username@gmail.com ',
  'username@harvard.edu',
  'username@harvard.subdomain.edu',
  '\nusername@harvard.subdomain.edu',
  '\n\tusername@harvard.subdomain.edu',
  'username@harvard.subdomain.edu\n',
  'username@harvard.subdomain.edu\n\t',
];

const invalidEmails = [
  '',
  ' ',
  'gmail.com',
  '@gmail.com ',
  'username',
  'username@.com',
  'user name@gmail.com',
  'username @gmail.com',
  'username@ gmail.com',
  'username@gmail .com',
  'username\t@gmail.com',
  'username\n@gmail.com',
  'username@gmail\n.com',
  'username@gmail.\tcom',
  'user\nname@gmail.com',
  'user\tname@gmail.com',
];

test('isValidEmail', () => {
  validEmails.forEach((email) => {
    expect(isValidEmail(email)).toStrictEqual(true);
  });

  invalidEmails.forEach((email) => {
    expect(isValidEmail(email)).toStrictEqual(false);
  });
});

test('getEntityCreationInfo', () => {
  expect(
    getEntityCreationInfo({
      entity_type: 'Dataset',
      published_timestamp: 1572559603311,
      last_modified_timestamp: 1721426610012,
      created_timestamp: 1572558930500,
    }),
  ).toStrictEqual({
    creationLabel: 'Publication Date',
    creationVerb: 'Published',
    creationTimestamp: 1572559603311,
    creationDate: '2019-10-31',
  });

  expect(
    getEntityCreationInfo({
      entity_type: 'Dataset',
      last_modified_timestamp: 1572559603311,
      created_timestamp: 1721426610012,
    }),
  ).toStrictEqual({
    creationLabel: 'Last Modified',
    creationVerb: 'Modified',
    creationTimestamp: 1572559603311,
    creationDate: '2019-10-31',
  });

  expect(
    getEntityCreationInfo({
      entity_type: 'Sample',
      created_timestamp: 1572559603311,
      published_timestamp: 1721426610012,
      last_modified_timestamp: 1572558930500,
    }),
  ).toStrictEqual({
    creationLabel: 'Creation Date',
    creationVerb: 'Created',
    creationTimestamp: 1572559603311,
    creationDate: '2019-10-31',
  });
});

test('validateAndFormatOrcidId', () => {
  expect(validateAndFormatOrcidId('0000-0002-2451-0633')).toEqual('0000-0002-2451-0633');
  expect(validateAndFormatOrcidId('0000-0002-2451-063X')).toEqual('0000-0002-2451-063X');
  expect(validateAndFormatOrcidId('0000000224510633')).toEqual('0000-0002-2451-0633');
  expect(validateAndFormatOrcidId('000000022451063X')).toEqual('0000-0002-2451-063X');
  expect(validateAndFormatOrcidId('')).toBeFalsy();
  expect(validateAndFormatOrcidId(undefined)).toBeFalsy();
  expect(validateAndFormatOrcidId('n/a')).toBeFalsy();
  expect(validateAndFormatOrcidId('  0000-0002-2451-0633  ')).toBeFalsy();
  expect(validateAndFormatOrcidId('0000 0002 2451 0633')).toBeFalsy();
  expect(validateAndFormatOrcidId('abcd-1234-5678-9101')).toBeFalsy();
  expect(validateAndFormatOrcidId('1234-5678-9101')).toBeFalsy();
  expect(validateAndFormatOrcidId('12345678901234567')).toBeFalsy();
});
