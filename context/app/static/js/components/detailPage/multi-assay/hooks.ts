import { useFlaskDataContext } from 'js/components/Contexts';
import { isDataset } from 'js/components/types';

interface UseIsMultiAssay {
  isMultiAssay: boolean;
  isSnareSeq2: boolean;
}

/**
 * Checks if the current dataset is a multi-assay dataset.
 * @returns {UseIsMultiAssay}
 */
export function useIsMultiAssay(): UseIsMultiAssay {
  const { entity } = useFlaskDataContext();
  const entityIsDataset = isDataset(entity);
  if (!entityIsDataset) {
    return {
      isMultiAssay: false,
      isSnareSeq2: false,
    };
  }
  return {
    isMultiAssay: entity.assay_modality === 'multiple',
    isSnareSeq2: entity.assay_modality === 'multiple' && entity.dataset_type.toLowerCase() === 'snare-seq2',
  };
}
