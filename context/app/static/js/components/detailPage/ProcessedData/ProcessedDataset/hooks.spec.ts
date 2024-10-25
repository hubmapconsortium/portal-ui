import { processDatasetLabel } from './hooks';

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

it('checks if bulk data transfer panels are labeled correctly', () => {
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

it('checks if bulk data transfer panels with duplicate analyses are labeled correctly', () => {
  const labels = hitsWithDuplicates.map((hit) => processDatasetLabel(hit._source, hitsWithDuplicates));
  expect(labels).toEqual([
    'Kaggle-1 Glomerulus Segmentation (QA) [HBM739.DJFC.689]',
    'Segmentation Mask (Published)',
    'Kaggle-1 Glomerulus Segmentation (QA) [HBM739.DJFC.675]',
    'Segmentation Mask (QA)',
    'Visium (no probes)',
  ]);
});
