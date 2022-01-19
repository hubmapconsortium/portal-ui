import { getDonorAgeString } from 'js/helpers/functions';

test('should return age value and unit separated by string', () => {
  expect(getDonorAgeString({ age_value: 'a', age_unit: 'b' })).toBe('a b');
});

test('should return empty string if either value is undefined', () => {
  expect(getDonorAgeString({ age_value: 'a' })).toBe('');
  expect(getDonorAgeString({ age_unit: 'b' })).toBe('');
  expect(getDonorAgeString({})).toBe('');
});
