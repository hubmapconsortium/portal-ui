import { useMemo } from 'react';
import { ProcessedDatasetInfo, useProcessedDatasets } from 'js/pages/Dataset/hooks';

export function createdByCentralProcess(dataset: Pick<ProcessedDatasetInfo, 'creation_action'>) {
  return dataset.creation_action === 'Central Process';
}

export function datasetIsPublished(dataset: Pick<ProcessedDatasetInfo, 'status'>) {
  return dataset.status === 'Published';
}

export function useSortedSearchHits(datasets: ReturnType<typeof useProcessedDatasets>['searchHits']) {
  const sortedSearchHits = useMemo(() => {
    const sorted = datasets.sort(({ _source: a }, { _source: b }) => {
      // internally processed datasets should be above externally processed datasets
      const aCreatedByCentralProcess = createdByCentralProcess(a);
      const bCreatedByCentralProcess = createdByCentralProcess(b);
      if (aCreatedByCentralProcess && !bCreatedByCentralProcess) {
        return -1;
      }
      if (!aCreatedByCentralProcess && bCreatedByCentralProcess) {
        return 1;
      }
      // published datasets should be at the top
      const aIsPublished = datasetIsPublished(a);
      const bIsPublished = datasetIsPublished(b);
      if (aIsPublished && !bIsPublished) {
        return -1;
      }
      if (!aIsPublished && bIsPublished) {
        return 1;
      }
      // Otherwise, sort by creation date.
      return a.created_timestamp - b.created_timestamp;
    });
    return sorted;
  }, [datasets]);
  return sortedSearchHits;
}
