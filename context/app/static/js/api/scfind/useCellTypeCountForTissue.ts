import useSWR from 'swr';
import { fetcher, multiFetcher } from 'js/helpers/swr';
import { createScFindKey, useScFindKey } from './utils';

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

type CellTypeCountForTissueKey = string | null;

export function createCellTypeCountForTissueKey(
  scFindEndpoint: string,
  { tissue }: CellTypeCountForTissueParams,
  scFindIndexVersion?: string,
): CellTypeCountForTissueKey | null {
  if (!tissue || tissue.length === 0) {
    return null;
  }
  return createScFindKey(
    scFindEndpoint,
    'cellTypeCountForTissue',
    {
      tissue,
    },
    scFindIndexVersion,
  );
}

export default function useCellTypeCountForTissue(props: CellTypeCountForTissueParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createCellTypeCountForTissueKey(scFindEndpoint, props, scFindIndexVersion);
  return useSWR<CellTypeCountsForTissue, unknown, CellTypeCountForTissueKey>(key, (url) => fetcher({ url }));
}

export function useCellTypeCountForTissues(tissues: string[]) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const keys = tissues
    .map((tissue) => createCellTypeCountForTissueKey(scFindEndpoint, { tissue }, scFindIndexVersion))
    .filter((key): key is string => key !== null);

  return useSWR<CellTypeCountsForTissue[], unknown, NonNullable<CellTypeCountForTissueKey>[]>(keys, (urls: string[]) =>
    multiFetcher({ urls }),
  );
}
