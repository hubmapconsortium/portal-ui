import { DatasetsForGenesResponse } from 'js/api/scfind/useFindDatasetForGenes';
import { useMemo } from 'react';

/**
 * Collapse a `findDatasets` aggregate slice into the matched-dataset id list + a hubmap_id -> count
 * map for the table's matching-gene column. The gene-detail aggregate queries a single gene, so we
 * read the one entry regardless of the exact key casing scFind echoes back.
 */
export function useGeneMatchedDatasets(data: DatasetsForGenesResponse | undefined) {
  return useMemo(() => {
    const findDatasets = data?.findDatasets ?? {};
    const allCounts = data?.counts ?? {};
    const key = Object.keys(findDatasets)[0];
    const datasets = key ? findDatasets[key] : [];
    const counts = key ? (allCounts[key] ?? []) : [];

    const countsMap: Record<string, number> = {};
    datasets.forEach((hubmapId, index) => {
      if (hubmapId) {
        countsMap[hubmapId] = counts[index] ?? 0;
      }
    });
    const ids = Object.keys(countsMap);
    return { ids, countsMap, datasetIds: ids.map((hubmap_id) => ({ hubmap_id })) };
  }, [data]);
}
