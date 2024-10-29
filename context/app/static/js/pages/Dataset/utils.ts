import { ProcessedDatasetInfo } from './hooks';

export function datasetSectionId(dataset: Pick<ProcessedDatasetInfo, 'hubmap_id'>, prefix = '') {
  return `${prefix}-${encodeURIComponent(dataset.hubmap_id)}`.toLowerCase();
}
