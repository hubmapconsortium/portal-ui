import { AggregatedData, aggregateByOrgan, getKeysFromAggregatedData } from './hooks';

const mockData = {
  undefined,
  empty: [],
  donorSex: [
    {
      doc_count: 12,
      key: {
        donor_sex: 'Female',
        organ: 'Bladder',
      },
    },
    {
      doc_count: 16,
      key: {
        donor_sex: 'Male',
        organ: 'Bladder',
      },
    },
    {
      doc_count: 1,
      key: {
        donor_sex: 'Male',
        organ: 'Blood',
      },
    },
    {
      doc_count: 7,
      key: {
        donor_sex: 'Female',
        organ: 'Brain',
      },
    },
    {
      doc_count: 7,
      key: {
        donor_sex: 'Male',
        organ: 'Brain',
      },
    },
    {
      doc_count: 13,
      key: {
        donor_sex: 'Female',
        organ: 'Heart',
      },
    },
    {
      doc_count: 45,
      key: {
        donor_sex: 'Male',
        organ: 'Heart',
      },
    },
    {
      doc_count: 245,
      key: {
        donor_sex: 'Female',
        organ: 'Kidney (Left)',
      },
    },
    {
      doc_count: 198,
      key: {
        donor_sex: 'Male',
        organ: 'Kidney (Left)',
      },
    },
    {
      doc_count: 161,
      key: {
        donor_sex: 'Female',
        organ: 'Kidney (Right)',
      },
    },
    {
      doc_count: 225,
      key: {
        donor_sex: 'Male',
        organ: 'Kidney (Right)',
      },
    },
    {
      doc_count: 4,
      key: {
        donor_sex: 'Male',
        organ: 'Knee (Left)',
      },
    },
    {
      doc_count: 10,
      key: {
        donor_sex: 'Female',
        organ: 'Knee (Right)',
      },
    },
    {
      doc_count: 12,
      key: {
        donor_sex: 'Male',
        organ: 'Knee (Right)',
      },
    },
    {
      doc_count: 162,
      key: {
        donor_sex: 'Female',
        organ: 'Large Intestine',
      },
    },
    {
      doc_count: 197,
      key: {
        donor_sex: 'Male',
        organ: 'Large Intestine',
      },
    },
    {
      doc_count: 6,
      key: {
        donor_sex: 'Female',
        organ: 'Liver',
      },
    },
    {
      doc_count: 10,
      key: {
        donor_sex: 'Male',
        organ: 'Liver',
      },
    },
    {
      doc_count: 2,
      key: {
        donor_sex: 'Female',
        organ: 'Lung (Right)',
      },
    },
    {
      doc_count: 127,
      key: {
        donor_sex: 'Male',
        organ: 'Lung (Right)',
      },
    },
    {
      doc_count: 15,
      key: {
        donor_sex: 'Female',
        organ: 'Lymph Node',
      },
    },
    {
      doc_count: 47,
      key: {
        donor_sex: 'Male',
        organ: 'Lymph Node',
      },
    },
    {
      doc_count: 3,
      key: {
        donor_sex: 'Female',
        organ: 'Pancreas',
      },
    },
    {
      doc_count: 2,
      key: {
        donor_sex: 'Male',
        organ: 'Pancreas',
      },
    },
    {
      doc_count: 6,
      key: {
        donor_sex: 'Female',
        organ: 'Skin',
      },
    },
    {
      doc_count: 6,
      key: {
        donor_sex: 'Male',
        organ: 'Skin',
      },
    },
    {
      doc_count: 168,
      key: {
        donor_sex: 'Female',
        organ: 'Small Intestine',
      },
    },
    {
      doc_count: 199,
      key: {
        donor_sex: 'Male',
        organ: 'Small Intestine',
      },
    },
    {
      doc_count: 30,
      key: {
        donor_sex: 'Female',
        organ: 'Spleen',
      },
    },
    {
      doc_count: 73,
      key: {
        donor_sex: 'Male',
        organ: 'Spleen',
      },
    },
    {
      doc_count: 10,
      key: {
        donor_sex: 'Female',
        organ: 'Thymus',
      },
    },
    {
      doc_count: 32,
      key: {
        donor_sex: 'Male',
        organ: 'Thymus',
      },
    },
    {
      doc_count: 211,
      key: {
        donor_sex: 'Female',
        organ: 'Uterus',
      },
    },
  ],
};

const mockFormattedData: Record<string, AggregatedData> = {
  empty: [],
  donorSex: [
    {
      organ: 'Bladder',
      Female: 12,
      Male: 16,
    },
    {
      organ: 'Blood',
      Male: 1,
    },
    {
      organ: 'Brain',
      Female: 7,
      Male: 7,
    },
    {
      organ: 'Heart',
      Female: 13,
      Male: 45,
    },
    {
      organ: 'Kidney (Left)',
      Female: 245,
      Male: 198,
    },
    {
      organ: 'Kidney (Right)',
      Female: 161,
      Male: 225,
    },
    {
      organ: 'Knee (Left)',
      Male: 4,
    },
    {
      organ: 'Knee (Right)',
      Female: 10,
      Male: 12,
    },
    {
      organ: 'Large Intestine',
      Female: 162,
      Male: 197,
    },
    {
      organ: 'Liver',
      Female: 6,
      Male: 10,
    },
    {
      organ: 'Lung (Right)',
      Female: 2,
      Male: 127,
    },
    {
      organ: 'Lymph Node',
      Female: 15,
      Male: 47,
    },
    {
      organ: 'Pancreas',
      Female: 3,
      Male: 2,
    },
    {
      organ: 'Skin',
      Female: 6,
      Male: 6,
    },
    {
      organ: 'Small Intestine',
      Female: 168,
      Male: 199,
    },
    {
      organ: 'Spleen',
      Female: 30,
      Male: 73,
    },
    {
      organ: 'Thymus',
      Female: 10,
      Male: 32,
    },
    {
      organ: 'Uterus',
      Female: 211,
    },
  ] as unknown as AggregatedData, // TS doesn't like organ not being a number here
};

test('aggregateByOrgan', () => {
  expect(aggregateByOrgan(mockData.undefined)).toEqual([]);
  expect(aggregateByOrgan(mockData.empty)).toEqual([]);
  expect(aggregateByOrgan(mockData.donorSex)).toEqual(mockFormattedData.donorSex);
});

test('getKeysFromAggregatedData', () => {
  expect(getKeysFromAggregatedData(mockFormattedData.empty)).toEqual([]);
  expect(getKeysFromAggregatedData(mockFormattedData.donorSex)).toEqual(['Female', 'Male']);
});
