import { getDatasetLD } from './schema.org';

test('full', () => {
  const entity = {
    mapped_data_types: ['Nifty Assay'],
    origin_sample: {
      mapped_organ: 'Elbow',
    },
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
    description: 'too short :(',
  };
  expect(getDatasetLD(entity)).toEqual({
    '@context': 'https://schema.org/',
    '@type': 'Dataset',
    description:
      'Nifty Assay of Elbow from 6.25 feet, 135 pounds, white male, 44 years old with ITP, melanoma. too short :(',
    name: 'Nifty Assay of Elbow from male, 44 years old',
  });
});

test('minimal, with donor', () => {
  const entity = {
    mapped_data_types: ['Nifty Assay'],
    origin_sample: {
      mapped_organ: 'Elbow',
    },
    donor: {
      mapped_metadata: {},
    },
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
    origin_sample: {
      mapped_organ: 'Elbow',
    },
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
