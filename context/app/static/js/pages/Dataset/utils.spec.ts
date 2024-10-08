import { datasetSectionId } from './utils';

const prefix = 'prefix';

describe('datasetSectionId', () => {
  it('should format the dataset section id correctly', () => {
    const dataset = {
      pipeline: 'pipeline',
      hubmap_id: 'hubmap_id',
      status: 'status',
    };
    expect(datasetSectionId(dataset, prefix)).toBe('prefix-pipeline-status');
  });
  it('Should include the hubmap id if the pipeline is missing', () => {
    const dataset = {
      hubmap_id: 'hubmap_id',
      status: 'status',
    };
    expect(datasetSectionId(dataset, prefix)).toBe('prefix-hubmap_id-status');
  });
  it('should include the pipeline and hubmap_id if the pipeline is errored', () => {
    const dataset = {
      pipeline: 'pipeline',
      hubmap_id: 'hubmap_id',
      status: 'error',
    };
    expect(datasetSectionId(dataset, prefix)).toBe('prefix-pipeline-error-hubmap_id');
  });
  it('should generate unique ids for different errored datasets', () => {
    const dataset1 = {
      pipeline: 'pipeline',
      hubmap_id: 'hubmap_id',
      status: 'error',
    };
    const dataset2 = {
      pipeline: 'pipeline',
      hubmap_id: 'hubmap_id_2',
      status: 'error',
    };
    expect(datasetSectionId(dataset1, prefix)).not.toBe(datasetSectionId(dataset2, prefix));
  });
});
