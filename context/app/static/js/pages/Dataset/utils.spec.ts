import { datasetSectionId, processDatasetLabel } from './utils';

const prefix = 'prefix';

describe('datasetSectionId', () => {
  it('should format the dataset section id correctly', () => {
    const dataset = {
      hubmap_id: 'hubmap_id',
    };
    expect(datasetSectionId(dataset, prefix)).toBe('prefix-hubmap_id');
  });
  it('should generate unique ids for different datasets', () => {
    const dataset1 = {
      hubmap_id: 'hubmap_id',
    };
    const dataset2 = {
      hubmap_id: 'hubmap_id_2',
    };
    expect(datasetSectionId(dataset1, prefix)).not.toBe(datasetSectionId(dataset2, prefix));
  });
});

const hits: {
  _source: {
    assay_display_name: string[];
    hubmap_id: string;
    pipeline?: string;
    status: string;
  };
}[] = [
  {
    _source: {
      assay_display_name: ['PAS Stained Microscopy [Kaggle-1 Glomerulus Segmentation]'],
      hubmap_id: 'HBM739.DJFC.689',
      pipeline: 'Kaggle-1 Glomerulus Segmentation',
      status: 'QA',
    },
  },
  {
    _source: {
      assay_display_name: ['Segmentation Mask'],
      hubmap_id: 'HBM984.FHHM.241',
      status: 'Published',
    },
  },
];

describe('processDatasetLabel', () => {
  it('should give unique labels to processed dataset sections', () => {
    const labels = hits.map((hit) => processDatasetLabel(hit._source, hits));
    expect(labels).toEqual(['Kaggle-1 Glomerulus Segmentation', 'Segmentation Mask']);
  });

  const hitsWithDuplicates = [
    ...hits,
    {
      _source: {
        assay_display_name: ['PAS Stained Microscopy [Kaggle-1 Glomerulus Segmentation]'],
        hubmap_id: 'HBM739.DJFC.675',
        pipeline: 'Kaggle-1 Glomerulus Segmentation',
        status: 'QA',
      },
    },
    {
      _source: {
        assay_display_name: ['Segmentation Mask'],
        hubmap_id: 'HBM984.FHHM.240',
        status: 'QA',
      },
    },
    {
      _source: {
        assay_display_name: ['Visium (no probes)'],
        hubmap_id: 'HBM878.KLWL.738',
        pipeline: 'Visium (no probes)',
        status: 'QA',
      },
    },
  ];

  it('should give unique labels to processed dataset sections with duplicate analyses', () => {
    const labels = hitsWithDuplicates.map((hit) => processDatasetLabel(hit._source, hitsWithDuplicates));
    expect(labels).toEqual([
      'Kaggle-1 Glomerulus Segmentation (QA) [HBM739.DJFC.689]',
      'Segmentation Mask (Published)',
      'Kaggle-1 Glomerulus Segmentation (QA) [HBM739.DJFC.675]',
      'Segmentation Mask (QA)',
      'Visium (no probes)',
    ]);
  });
});
