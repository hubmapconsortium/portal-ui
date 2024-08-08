import { Entity, isDataset, isDonor, isPublication, isSample } from 'js/components/types';

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

export function getDonorMetadata(entity: Entity) {
  if (isDonor(entity)) {
    return entity.mapped_metadata;
  }

  if (isSample(entity) || isDataset(entity)) {
    return entity.donor.mapped_metadata;
  }

  return null;
}

export function getSampleCategories(entity: Entity) {
  if (!isSample(entity)) {
    return null;
  }

  return entity.sample_category;
}

export function getOriginSampleAndMappedOrgan(entity: Entity) {
  if (!isSample(entity) || isDataset(entity)) {
    return null;
  }

  const origin_sample = entity.origin_samples[0];
  return { origin_sample, mapped_organ: origin_sample.mapped_organ };
}

export function getDataTypes(entity: Entity) {
  if (!isDataset(entity)) {
    return null;
  }

  return entity.mapped_data_types?.join(', ');
}

export function getPublicationVenue(entity: Entity) {
  if (!isPublication(entity)) {
    return null;
  }

  return entity.publication_venue;
}

export function getPublicationTitle(entity: Entity) {
  if (!isPublication(entity)) {
    return null;
  }

  return entity.title;
}
