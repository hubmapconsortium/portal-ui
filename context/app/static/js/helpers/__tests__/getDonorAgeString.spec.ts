import { getDonorAgeString } from 'js/helpers/functions';

test('should return age value and unit separated by string', () => {
  expect(getDonorAgeString({ age_value: 1, age_unit: 'b' })).toBe('1 b');
});

test('should return empty string if either value is undefined', () => {
  expect(getDonorAgeString({ age_value: 1 })).toBe('');
  expect(getDonorAgeString({ age_unit: 'b' })).toBe('');
  expect(getDonorAgeString({})).toBe('');
});
