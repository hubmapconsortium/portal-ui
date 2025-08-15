import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

export interface CellTypeCountForDataset {
  count: number;
  index: string;
}

export interface CellTypeCountsForDataset {
  cellTypeCounts: CellTypeCountForDataset[];
}

export interface CellTypeCountForDatasetParams {
  dataset: string;
}

type CellTypeCountForDatasetKey = string;

export function createCellTypeCountForDatasetKey(
  scFindEndpoint: string,
  { dataset }: CellTypeCountForDatasetParams,
  scFindIndexVersion?: string,
): CellTypeCountForDatasetKey {
  return createScFindKey(
    scFindEndpoint,
    'cellTypeCountForDataset',
    {
      dataset,
    },
    scFindIndexVersion,
  );
}

export default function useCellTypeCountForDataset(props: CellTypeCountForDatasetParams) {
  const { scFindEndpoint, scFindIndexVersion } = useAppContext();
  const key = createCellTypeCountForDatasetKey(scFindEndpoint, props, scFindIndexVersion);
  return useSWR<CellTypeCountsForDataset, unknown, CellTypeCountForDatasetKey>(key, (url) => fetcher({ url }));
}
