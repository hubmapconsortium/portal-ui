import { extractHeaderMetadata } from './utils';

test('should handle defined and undefined keys and mapping correct labels', () => {
  const assayMetadata = {
    origin_sample: {
      mapped_organ: 'fake_organ',
    },
    entity_type: 'Dataset',
  };
  expect(extractHeaderMetadata(assayMetadata)).toEqual({
    mapped_data_types: { value: undefined, label: 'data type' },
    mapped_organ: { value: 'fake_organ', label: 'organ type' },
  });
});

test('should return correct donor age field and unmapped labels', () => {
  const assayMetadata = {
    mapped_metadata: {
      age_value: 50,
      age_unit: 'years',
    },
    entity_type: 'Donor',
  };
  expect(extractHeaderMetadata(assayMetadata)).toEqual({
    sex: { value: undefined, label: 'sex' },
    race: { value: undefined, label: 'race' },
    age: { value: '50 years', label: 'age' },
  });
});
