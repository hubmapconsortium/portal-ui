import { isSupport } from 'js/components/types';
import { ProcessedDatasetInfo } from 'js/pages/Dataset/hooks';

export const isKaggle1 = (sectionDataset: ProcessedDatasetInfo) =>
  sectionDataset.pipeline === 'Kaggle-1 Glomerulus Segmentation';

export const shouldIncludeParent = (sectionDataset: ProcessedDatasetInfo) => {
  return isSupport(sectionDataset) || isKaggle1(sectionDataset);
};
