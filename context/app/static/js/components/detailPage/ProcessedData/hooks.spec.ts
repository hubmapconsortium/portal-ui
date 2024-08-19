import { renderHook } from 'test-utils/functions';
import { useSortedSearchHits, createdByCentralProcess, datasetIsPublished } from './hooks';

const testDatasets = [
  {
    _id: 'c1fc38a4a6139a4830b8b2aec7227a8e',
    _index: 'hm_prod_consortium_portal',
    _score: 1,
    _source: {
      assay_display_name: ['CODEX [Cytokit + SPRM]'],
      created_timestamp: 1688952984040,
      creation_action: 'Central Process',
      entity_type: 'Dataset',
      hubmap_id: 'HBM984.FHHM.238',
      pipeline: 'Cytokit + SPRM',
      status: 'QA',
      uuid: 'c1fc38a4a6139a4830b8b2aec7227a8e',
      visualization: true,
    },
    _type: '_doc',
  },
  {
    _id: 'a61523fefe63ff37760a30ff34e53b5f',
    _index: 'hm_prod_consortium_portal',
    _score: 1,
    _source: {
      assay_display_name: ['CODEX [Cytokit + SPRM]'],
      created_timestamp: 1689198074733,
      creation_action: 'Central Process',
      entity_type: 'Dataset',
      hubmap_id: 'HBM236.WBFT.443',
      pipeline: 'Cytokit + SPRM',
      status: 'Published',
      uuid: 'a61523fefe63ff37760a30ff34e53b5f',
      visualization: true,
    },
    _type: '_doc',
  },
  {
    _id: 'abcdef123456epic',
    _index: 'hm_prod_consortium_portal',
    _score: 1,
    _source: {
      assay_display_name: ['External (Segmentation Mask)'],
      created_timestamp: 1689198074733,
      creation_action: 'External Process',
      entity_type: 'Dataset',
      hubmap_id: 'HBM001.EPIC.999',
      pipeline: 'Segmentation Mask',
      status: 'Published',
      uuid: 'abcdef123456epic',
      visualization: true,
    },
    _type: '_doc',
  },
];

it('sorts datasets by status and creation date', () => {
  // Copy so that we don't mutate the original data
  const testDatasetCopy = [...testDatasets];
  // @ts-expect-error Passing in partial data for test
  const { result } = renderHook(() => useSortedSearchHits(testDatasetCopy));
  expect(result.current[0]._source.hubmap_id).toBe('HBM236.WBFT.443');
  expect(result.current[1]._source.hubmap_id).toBe('HBM984.FHHM.238');
  expect(result.current[2]._source.hubmap_id).toBe('HBM001.EPIC.999');
});

it('checks if dataset was created by central process', () => {
  expect(createdByCentralProcess(testDatasets[0]._source)).toBe(true);
  expect(createdByCentralProcess(testDatasets[1]._source)).toBe(true);
  expect(createdByCentralProcess({ creation_action: 'External Process' })).toBe(false);
});

it('checks if dataset is published', () => {
  expect(datasetIsPublished(testDatasets[0]._source)).toBe(false);
  expect(datasetIsPublished(testDatasets[1]._source)).toBe(true);
  expect(datasetIsPublished(testDatasets[2]._source)).toBe(true);
});
