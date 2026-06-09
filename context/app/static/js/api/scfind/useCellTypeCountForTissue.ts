import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindFlaskKey } from './utils';

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

export function createCellTypeCountForTissueKey({
  tissue,
  modality,
}: CellTypeCountForTissueParams): CellTypeCountForTissueKey | null {
  if (!tissue || tissue.length === 0) {
    return null;
  }
  return createScFindFlaskKey('/scfind/cell-type-count-for-tissue.json', {
    tissue,
    modality,
  });
}

export default function useCellTypeCountForTissue(props: CellTypeCountForTissueParams) {
  const key = createCellTypeCountForTissueKey(props);
  return useSWR<CellTypeCountsForTissue, unknown, CellTypeCountForTissueKey>(key, (url) => fetcher({ url }));
}

const emptyCellTypeCounts: CellTypeCountsForTissue = { cellTypeCounts: [] };

export function useCellTypeCountForTissues(tissues: string[], modality?: string) {
  const keys = tissues
    .map((tissue) => createCellTypeCountForTissueKey({ tissue, modality }))
    .filter((key): key is string => key !== null);

  return useSWR<CellTypeCountsForTissue[], unknown, NonNullable<CellTypeCountForTissueKey>[]>(keys, (urls: string[]) =>
    // Fetch each tissue independently and tolerate per-tissue failures: a tissue/modality combo that
    // isn't indexed (e.g. ATAC for an unindexed organ) returns a 500 from scFind, which should degrade
    // to zero cells for that bar rather than blanking the whole chart. Order is preserved so the results
    // stay aligned with the requested tissues.
    Promise.all(urls.map((url) => fetcher<CellTypeCountsForTissue>({ url }).catch(() => emptyCellTypeCounts))),
  );
}
