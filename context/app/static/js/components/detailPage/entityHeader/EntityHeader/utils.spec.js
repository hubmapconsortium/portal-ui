import { extractHeaderMetadata } from './utils';

test('should handle defined and undefined keys and mapping correct labels', () => {
  const assayMetadata = {
    mapped_organ: 'fake_organ',
  };
  expect(extractHeaderMetadata(assayMetadata, 'Dataset')).toEqual({
    mapped_data_types: { value: undefined, label: 'data type' },
    mapped_organ: { value: 'fake_organ', label: 'organ type' },
  });
});

test('should return correct donor age field and unmapped labels', () => {
  const assayMetadata = {
    age_value: 50,
    age_unit: 'years',
  };
  expect(extractHeaderMetadata(assayMetadata, 'Donor')).toEqual({
    sex: { value: undefined, label: 'sex' },
    race: { value: undefined, label: 'race' },
    age: { value: '50 years', label: 'age' },
  });
});

test('should join races with comma', () => {
  const assayMetadata = {
    race: ['Human', 'Klingon'],
  };
  expect(extractHeaderMetadata(assayMetadata, 'Donor')).toEqual({
    sex: { value: undefined, label: 'sex' },
    race: { value: 'Human, Klingon', label: 'race' },
  });
});
