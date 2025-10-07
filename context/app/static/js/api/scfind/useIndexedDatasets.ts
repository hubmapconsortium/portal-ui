import useSWR from 'swr/immutable';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, useScFindKey } from './utils';

type IndexedDatasetsKey = string;

interface IndexedDatasetsResponse {
  datasets: string[];
  counts: number[];
}

interface AugmentedIndexedDatasetsResponse extends IndexedDatasetsResponse {
  countsMap: Record<string, number>;
}

export function createIndexedDatasetsKey(scFindEndpoint: string, scFindIndexVersion?: string): IndexedDatasetsKey {
  return createScFindKey(scFindEndpoint, 'getDatasets', {}, scFindIndexVersion);
}

export default function useIndexedDatasets() {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createIndexedDatasetsKey(scFindEndpoint, scFindIndexVersion);
  const swr = useSWR<AugmentedIndexedDatasetsResponse, Error, IndexedDatasetsKey>(key, (url) =>
    fetcher<IndexedDatasetsResponse>({ url }).then((d) => {
      const countsMap = d.counts.reduce<Record<string, number>>((acc, count, index) => {
        acc[d.datasets[index]] = count;
        return acc;
      }, {});
      return { ...d, countsMap };
    }),
  );
  return swr;
}
