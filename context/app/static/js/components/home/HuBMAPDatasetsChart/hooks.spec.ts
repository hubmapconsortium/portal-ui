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
      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 16,
      key: {
        donor_sex: 'Male',
        organ: 'Bladder',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 1,
      key: {
        donor_sex: 'Male',
        organ: 'Blood',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 7,
      key: {
        donor_sex: 'Female',
        organ: 'Brain',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 7,
      key: {
        donor_sex: 'Male',
        organ: 'Brain',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 13,
      key: {
        donor_sex: 'Female',
        organ: 'Heart',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 45,
      key: {
        donor_sex: 'Male',
        organ: 'Heart',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 245,
      key: {
        donor_sex: 'Female',
        organ: 'Kidney (Left)',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 198,
      key: {
        donor_sex: 'Male',
        organ: 'Kidney (Left)',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 161,
      key: {
        donor_sex: 'Female',
        organ: 'Kidney (Right)',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 225,
      key: {
        donor_sex: 'Male',
        organ: 'Kidney (Right)',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 4,
      key: {
        donor_sex: 'Male',
        organ: 'Knee (Left)',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 10,
      key: {
        donor_sex: 'Female',
        organ: 'Knee (Right)',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 12,
      key: {
        donor_sex: 'Male',
        organ: 'Knee (Right)',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 162,
      key: {
        donor_sex: 'Female',
        organ: 'Large Intestine',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 197,
      key: {
        donor_sex: 'Male',
        organ: 'Large Intestine',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 6,
      key: {
        donor_sex: 'Female',
        organ: 'Liver',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 10,
      key: {
        donor_sex: 'Male',
        organ: 'Liver',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 2,
      key: {
        donor_sex: 'Female',
        organ: 'Lung (Right)',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 127,
      key: {
        donor_sex: 'Male',
        organ: 'Lung (Right)',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 15,
      key: {
        donor_sex: 'Female',
        organ: 'Lymph Node',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 47,
      key: {
        donor_sex: 'Male',
        organ: 'Lymph Node',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 3,
      key: {
        donor_sex: 'Female',
        organ: 'Pancreas',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 2,
      key: {
        donor_sex: 'Male',
        organ: 'Pancreas',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 6,
      key: {
        donor_sex: 'Female',
        organ: 'Skin',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 6,
      key: {
        donor_sex: 'Male',
        organ: 'Skin',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 168,
      key: {
        donor_sex: 'Female',
        organ: 'Small Intestine',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 199,
      key: {
        donor_sex: 'Male',
        organ: 'Small Intestine',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 30,
      key: {
        donor_sex: 'Female',
        organ: 'Spleen',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 73,
      key: {
        donor_sex: 'Male',
        organ: 'Spleen',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 10,
      key: {
        donor_sex: 'Female',
        organ: 'Thymus',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 32,
      key: {
        donor_sex: 'Male',
        organ: 'Thymus',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
    {
      doc_count: 211,
      key: {
        donor_sex: 'Female',
        organ: 'Uterus',
      },

      donor_uuids: {
        buckets: [
          {
            doc_count: 12,
            key: 'uuid1',
          },
          {
            doc_count: 4,
            key: 'uuid2',
          },
        ],
      },
    },
  ],
};

const mockFormattedData: Record<string, AggregatedData> = {
  empty: [],
  donorSex: [
    {
      organ: 'Bladder',
      data: { Female: 12, Male: 16 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Blood',
      data: { Male: 1 },
      displayLabels: { Male: 'Male' },
    },
    {
      organ: 'Brain',
      data: { Female: 7, Male: 7 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Heart',
      data: { Female: 13, Male: 45 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Kidney (Left)',
      data: { Female: 245, Male: 198 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Kidney (Right)',
      data: { Female: 161, Male: 225 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Knee (Left)',
      data: { Male: 4 },
      displayLabels: { Male: 'Male' },
    },
    {
      organ: 'Knee (Right)',
      data: { Female: 10, Male: 12 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Large Intestine',
      data: { Female: 162, Male: 197 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Liver',
      data: { Female: 6, Male: 10 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Lung (Right)',
      data: { Female: 2, Male: 127 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Lymph Node',
      data: { Female: 15, Male: 47 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Pancreas',
      data: { Female: 3, Male: 2 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Skin',
      data: { Female: 6, Male: 6 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Small Intestine',
      data: { Female: 168, Male: 199 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Spleen',
      data: { Female: 30, Male: 73 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Thymus',
      data: { Female: 10, Male: 32 },
      displayLabels: { Female: 'Female', Male: 'Male' },
    },
    {
      organ: 'Uterus',
      data: { Female: 211 },
      displayLabels: { Female: 'Female' },
    },
  ],
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
