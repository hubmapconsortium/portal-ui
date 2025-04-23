import useSWR from 'swr/immutable';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

type IndexedDatasetsKey = string;

interface IndexedDatasetsResponse {
  datasets: string[];
}

export function createIndexedDatasetsKey(scFindEndpoint: string): IndexedDatasetsKey {
  return createScFindKey(scFindEndpoint, 'getDatasets', {});
}

export default function useIndexedDatasets() {
  const { scFindEndpoint } = useAppContext();
  const key = createIndexedDatasetsKey(scFindEndpoint);
  const swr = useSWR<IndexedDatasetsResponse, unknown, IndexedDatasetsKey>(key, (url) => fetcher({ url }));

  return swr;
}
