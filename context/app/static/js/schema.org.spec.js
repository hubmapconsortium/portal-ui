import { getDatasetLD } from './schema.org';

test('minimal, with donor', () => {
  const entity = {
    mapped_data_types: ['Nifty Assay'],
    origin_sample: {
      mapped_organ: 'Elbow',
    },
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
      'Nifty Assay of Elbow from , ,  (Unknown sex), (Unknown age) (Unknown age unit) old with no medical history. too short :(',
    name: 'Nifty Assay of Elbow from (Unknown sex), (Unknown age) (Unknown age unit) old',
  });
});

test('no donor', () => {
  const entity = {
    mapped_data_types: ['Nifty Assay'],
    origin_sample: {
      mapped_organ: 'Elbow',
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
    description: 'Nifty Assay of Elbow from unknown donor. too short :(',
    name: 'Nifty Assay of Elbow from unknown donor',
  });
});
