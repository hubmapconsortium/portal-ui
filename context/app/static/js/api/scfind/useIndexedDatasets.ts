import useSWR from 'swr/immutable';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, useScFindKey } from './utils';
import { useMemo } from 'react';

type IndexedDatasetsKey = string;

interface IndexedDatasetsResponse {
  datasets: string[];
  counts: number[];
}

export function createIndexedDatasetsKey(scFindEndpoint: string, scFindIndexVersion?: string): IndexedDatasetsKey {
  return createScFindKey(scFindEndpoint, 'getDatasets', {}, scFindIndexVersion);
}

export default function useIndexedDatasets() {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createIndexedDatasetsKey(scFindEndpoint, scFindIndexVersion);
  const swr = useSWR<IndexedDatasetsResponse, Error, IndexedDatasetsKey>(key, (url) => fetcher({ url }));

  return swr;
}

export function useIndexedDatasetsCounts() {
  const { data, error, isLoading, ...rest } = useIndexedDatasets();

  return useMemo(() => {
    if (data) {
      const countsMap: Record<string, number> = {};
      data.datasets.forEach((datasetId, index) => {
        countsMap[datasetId] = data.counts[index];
      });
      return { data: countsMap, error, isLoading, ...rest };
    }
    return { data: undefined, error, isLoading, ...rest };
  }, [data, error, isLoading, rest]);
}
