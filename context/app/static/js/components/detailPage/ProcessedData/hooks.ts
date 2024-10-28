import { useMemo } from 'react';
import { ProcessedDatasetInfo, useProcessedDatasets } from 'js/pages/Dataset/hooks';
import { generateCommaList } from 'js/helpers/functions';

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

/**
 * Formats the processed datasets' analyses and their counts for presentation.
 * @param datasets The processed datasets to count the analyses of.
 * @returns Text for the analyses label, and additional text for each analysis and its count.
 */
export function useAnalysesCountInfo(datasets: Pick<ProcessedDatasetInfo, 'pipeline' | 'assay_display_name'>[]) {
  const analyses = datasets.map((dataset) => dataset.pipeline ?? dataset.assay_display_name);
  const analysesCount = analyses.reduce(
    (acc, analysis) => {
      acc[analysis] = (acc[analysis] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const analysesText = `Analyses (${Object.keys(analysesCount).length})`;
  const analysesCountText = generateCommaList(
    Object.entries(analysesCount).map(([analysis, count]) => (count > 1 ? `${analysis} (${count})` : analysis)),
  );

  return {
    analysesText,
    analysesCountText,
  };
}
