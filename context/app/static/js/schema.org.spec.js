import { getDatasetLD } from './schema.org';

test('full', () => {
  const entity = {
    mapped_data_types: ['Nifty Assay'],
    origin_samples_unique_mapped_organs: ['Elbow'],
    donor: {
      mapped_metadata: {
        sex: 'male',
        race: 'white',
        age_value: 44,
        age_unit: 'years',
        height_value: 6.25,
        height_unit: 'feet',
        weight_value: 135,
        weight_unit: 'pounds',
        medicalHistory: ['ITP', 'melanoma'],
      },
    },
    created_by_user_displayname: 'Lisa',
    group_name: 'The Simpsons',
    description: 'too short :(',
  };
  expect(getDatasetLD(entity)).toEqual({
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    creator: [
      {
        '@type': 'Person',
        name: 'Lisa',
      },
      {
        '@type': 'Organization',
        name: 'The Simpsons',
      },
    ],
    description:
      'Nifty Assay of Elbow from 6.25 feet, 135 pounds, white male, 44 years old with ITP, melanoma. too short :(',
    name: 'Nifty Assay of Elbow from male, 44 years old',
  });
});

test('minimal, with donor', () => {
  const entity = {
    mapped_data_types: ['Nifty Assay'],
    origin_samples_unique_mapped_organs: ['Elbow'],
    donor: {
      mapped_metadata: {},
    },
    created_by_user_displayname: 'Lisa',
    group_name: 'The Simpsons',
    description: 'too short :(',
  };
  expect(getDatasetLD(entity)).toEqual({
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    creator: [
      {
        '@type': 'Person',
        name: 'Lisa',
      },
      {
        '@type': 'Organization',
        name: 'The Simpsons',
      },
    ],
    description:
      'Nifty Assay of Elbow from  ,  ,  (Unknown sex), (Unknown age) (Unknown age unit) old with no medical history. too short :(',
    name: 'Nifty Assay of Elbow from (Unknown sex), (Unknown age) (Unknown age unit) old',
  });
});

test('no donor', () => {
  const entity = {
    mapped_data_types: ['Nifty Assay'],
    origin_samples_unique_mapped_organs: ['Elbow'],
    created_by_user_displayname: 'Lisa',
    group_name: 'The Simpsons',
    description: 'too short :(',
  };
  expect(getDatasetLD(entity)).toEqual({
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    creator: [
      {
        '@type': 'Person',
        name: 'Lisa',
      },
      {
        '@type': 'Organization',
        name: 'The Simpsons',
      },
    ],
    description: 'Nifty Assay of Elbow from unknown donor. too short :(',
    name: 'Nifty Assay of Elbow from unknown donor',
  });
});

test('multiple organs', () => {
  const entity = {
    mapped_data_types: ['Nifty Assay'],
    origin_samples_unique_mapped_organs: ['Elbow', 'Knee'],
    created_by_user_displayname: 'Lisa',
    group_name: 'The Simpsons',
    description: 'too short :(',
  };
  expect(getDatasetLD(entity)).toEqual({
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    creator: [
      {
        '@type': 'Person',
        name: 'Lisa',
      },
      {
        '@type': 'Organization',
        name: 'The Simpsons',
      },
    ],
    description: 'Nifty Assay of Elbow, Knee from unknown donor. too short :(',
    name: 'Nifty Assay of Elbow, Knee from unknown donor',
  });
});
