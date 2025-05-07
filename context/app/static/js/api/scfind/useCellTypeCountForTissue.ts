import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

export interface CellTypeCountForTissue {
  cell_count: number;
  index: string;
}

interface CellTypeCountsForTissue {
  cellTypeCounts: CellTypeCountForTissue[];
}

export interface CellTypeCountForTissueParams {
  tissue: string;
}

type CellTypeCountForTissueKey = string;

export function createCellTypeCountForTissueKey(
  scFindEndpoint: string,
  { tissue }: CellTypeCountForTissueParams,
): CellTypeCountForTissueKey {
  return createScFindKey(scFindEndpoint, 'cellTypeCountForTissue', {
    tissue,
  });
}

export default function useCellTypeCountForTissue(props: CellTypeCountForTissueParams) {
  const { scFindEndpoint } = useAppContext();
  const key = createCellTypeCountForTissueKey(scFindEndpoint, props);
  return useSWR<CellTypeCountsForTissue, unknown, CellTypeCountForTissueKey>(key, (url) => fetcher({ url }));
}
