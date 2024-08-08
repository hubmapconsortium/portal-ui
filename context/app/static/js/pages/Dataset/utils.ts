import { ProcessedDatasetInfo } from './hooks';

export function datasetSectionId(dataset: ProcessedDatasetInfo, prefix: string) {
  const { pipeline, hubmap_id, status } = dataset;
  const formattedDatasetIdentifier = (pipeline ?? hubmap_id).replace(/\s/g, '');
  const formattedStatus = status.replace(/\s/g, '');
  return `${prefix}-${encodeURIComponent(formattedDatasetIdentifier)}-${encodeURIComponent(formattedStatus)}`.toLowerCase();
}
