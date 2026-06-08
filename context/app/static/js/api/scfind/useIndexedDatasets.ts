import useSWR from 'swr/immutable';
import { fetcher } from 'js/helpers/swr';
import { createScFindFlaskKey } from './utils';

type IndexedDatasetsKey = string;

interface IndexedDatasetsResponse {
  datasets: string[];
  counts: number[];
}

interface AugmentedIndexedDatasetsResponse extends IndexedDatasetsResponse {
  countsMap: Record<string, number>;
}

export function createIndexedDatasetsKey(modality?: string): IndexedDatasetsKey {
  return createScFindFlaskKey('/scfind/indexed-datasets.json', { modality });
}

export default function useIndexedDatasets(modality?: string) {
  const key = createIndexedDatasetsKey(modality);
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
