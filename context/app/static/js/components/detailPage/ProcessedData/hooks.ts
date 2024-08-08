import { useMemo } from 'react';
import { ProcessedDatasetInfo, useProcessedDatasets } from 'js/pages/Dataset/hooks';

function createdByCentralProcess(dataset: ProcessedDatasetInfo) {
  return dataset.creation_action === 'Central Process';
}

function datasetIsPublished(dataset: ProcessedDatasetInfo) {
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
