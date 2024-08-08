import { ProcessedDatasetDetails } from './ProcessedData/ProcessedDataset/hooks';

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

/**
 * Helper function to handle different date labels for creation and publication dates
 * depending on dataset status
 * @param dataset
 * @returns [label: string, value: number]
 */
export function getDateLabelAndValue(
  dataset: Pick<ProcessedDatasetDetails, 'published_timestamp' | 'created_timestamp' | 'status'>,
): [string, number] {
  const { published_timestamp, created_timestamp, status } = dataset;

  if (status.toLowerCase() === 'published') {
    return ['Publication Date', published_timestamp];
  }

  return ['Creation Date', created_timestamp];
}
