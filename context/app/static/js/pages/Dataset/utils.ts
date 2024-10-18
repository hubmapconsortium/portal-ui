import { ProcessedDatasetInfo } from './hooks';

const potentialDuplicateStates = ['error'];

export function datasetSectionId(
  dataset: Pick<ProcessedDatasetInfo, 'hubmap_id' | 'status'> & { pipeline?: string },
  prefix = '',
) {
  const { pipeline, hubmap_id, status } = dataset;
  const formattedDatasetIdentifier = (pipeline ?? hubmap_id).replace(/\s/g, '');
  const formattedStatus = status.replace(/\s/g, '');
  const deduplicatedFormattedStatus = potentialDuplicateStates.includes(formattedStatus.toLowerCase())
    ? `${formattedStatus}-${hubmap_id}`
    : formattedStatus;
  return `${prefix}-${encodeURIComponent(formattedDatasetIdentifier)}-${encodeURIComponent(deduplicatedFormattedStatus)}`.toLowerCase();
}
