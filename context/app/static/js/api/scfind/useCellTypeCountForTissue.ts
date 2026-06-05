import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
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
  modality?: string;
}

type CellTypeCountForTissueKey = string | null;

export function createCellTypeCountForTissueKey(
  scFindEndpoint: string,
  { tissue, modality }: CellTypeCountForTissueParams,
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
      modality,
    },
    scFindIndexVersion,
  );
}

export default function useCellTypeCountForTissue(props: CellTypeCountForTissueParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createCellTypeCountForTissueKey(scFindEndpoint, props, scFindIndexVersion);
  return useSWR<CellTypeCountsForTissue, unknown, CellTypeCountForTissueKey>(key, (url) => fetcher({ url }));
}

const emptyCellTypeCounts: CellTypeCountsForTissue = { cellTypeCounts: [] };

export function useCellTypeCountForTissues(tissues: string[], modality?: string) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const keys = tissues
    .map((tissue) => createCellTypeCountForTissueKey(scFindEndpoint, { tissue, modality }, scFindIndexVersion))
    .filter((key): key is string => key !== null);

  return useSWR<CellTypeCountsForTissue[], unknown, NonNullable<CellTypeCountForTissueKey>[]>(keys, (urls: string[]) =>
    // Fetch each tissue independently and tolerate per-tissue failures: a tissue/modality combo that
    // isn't indexed (e.g. ATAC for an unindexed organ) returns a 500 from scFind, which should degrade
    // to zero cells for that bar rather than blanking the whole chart. Order is preserved so the results
    // stay aligned with the requested tissues.
    Promise.all(urls.map((url) => fetcher<CellTypeCountsForTissue>({ url }).catch(() => emptyCellTypeCounts))),
  );
}
