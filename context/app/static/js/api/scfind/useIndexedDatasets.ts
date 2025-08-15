import useSWR from 'swr/immutable';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

type IndexedDatasetsKey = string;

interface IndexedDatasetsResponse {
  datasets: string[];
}

export function createIndexedDatasetsKey(scFindEndpoint: string, scFindIndexVersion?: string): IndexedDatasetsKey {
  return createScFindKey(scFindEndpoint, 'getDatasets', {}, scFindIndexVersion);
}

export default function useIndexedDatasets() {
  const { scFindEndpoint, scFindIndexVersion } = useAppContext();
  const key = createIndexedDatasetsKey(scFindEndpoint, scFindIndexVersion);
  const swr = useSWR<IndexedDatasetsResponse, Error, IndexedDatasetsKey>(key, (url) => fetcher({ url }));

  return swr;
}
