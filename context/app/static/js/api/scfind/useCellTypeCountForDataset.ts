import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

interface CellTypeCountForDataset {
  count: number;
  index: string;
}

interface CellTypeCountsForDataset {
  cellTypeCounts: CellTypeCountForDataset[];
}

export interface CellTypeCountForDatasetParams {
  dataset: string;
}

type CellTypeCountForDatasetKey = string;

export function createCellTypeMarkersKey(
  scFindEndpoint: string,
  { dataset }: CellTypeCountForDatasetParams,
): CellTypeCountForDatasetKey {
  return createScFindKey(scFindEndpoint, 'cellTypeCountForDataset', {
    dataset,
  });
}

export default function useCellTypeMarkers(props: CellTypeCountForDatasetParams) {
  const { scFindEndpoint } = useAppContext();
  const key = createCellTypeMarkersKey(scFindEndpoint, props);
  return useSWR<CellTypeCountsForDataset, unknown, CellTypeCountForDatasetKey>(key, (url) => fetcher({ url }));
}
