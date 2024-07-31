import { ProcessedDatasetTypes } from 'js/pages/Dataset/hooks';

export interface ProcessedDataVisualizationProps {
  conf: object;
  dataset: ProcessedDatasetTypes;
  isLoading?: boolean;
}
