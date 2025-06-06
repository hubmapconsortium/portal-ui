import { Dataset, Donor, isDataset, isDonor, isSample, Sample } from 'js/components/types';
import useProcessedDataStore from 'js/components/detailPage/ProcessedData/store';

export function getSectionOrder(
  possibleSections: string[],
  optionalSectionsToInclude: Record<string, boolean>,
): string[] {
  return possibleSections.filter(
    (section) => !(section in optionalSectionsToInclude) || optionalSectionsToInclude[section],
  );
}

export function getCombinedDatasetStatus({ sub_status, status }: { sub_status?: string; status: string }) {
  return sub_status ?? status;
}

export function getDonorMetadata(entity: Donor | Sample | Dataset) {
  if (isDonor(entity)) {
    return entity?.mapped_metadata ?? {};
  }

  if (isSample(entity) || isDataset(entity)) {
    return entity?.donor.mapped_metadata ?? {};
  }

  return {};
}

export function getOriginSampleAndMappedOrgan(entity: Sample | Dataset) {
  const origin_sample = entity.origin_samples[0];
  return { origin_sample, mapped_organ: origin_sample.mapped_organ };
}

export function useCurrentDataset() {
  return useProcessedDataStore((state) => state.currentDataset);
}
