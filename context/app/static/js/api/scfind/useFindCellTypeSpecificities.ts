import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey, stringOrArrayToString } from './utils';

export interface FindCellTypeSpecificitiesParams {
  geneList?: string | string[];
  datasets?: string | string[];
  minCells?: number;
  minFraction?: number;
}

type CellTypeSpecificitiesKey = string;

interface FindCellTypeSpecificitiesResponse {
  cellTypeSpecificities: unknown;
}

export function createCellTypeSpecificitiesKey(
  scFindEndpoint: string,
  { geneList, datasets, minCells, minFraction }: FindCellTypeSpecificitiesParams,
  scFindIndexVersion?: string,
): CellTypeSpecificitiesKey {
  return createScFindKey(
    scFindEndpoint,
    'findCellTypeSpecificities',
    {
      gene_list: geneList ? stringOrArrayToString(geneList) : undefined,
      datasets: datasets ? stringOrArrayToString(datasets) : undefined,
      min_cells: minCells ? String(minCells) : undefined,
      min_fraction: minFraction ? String(minFraction) : undefined,
    },
    scFindIndexVersion,
  );
}

export default function useFindCellTypeSpecificities(params: FindCellTypeSpecificitiesParams) {
  const { scFindEndpoint, scFindIndexVersion } = useAppContext();
  const key = createCellTypeSpecificitiesKey(scFindEndpoint, params, scFindIndexVersion);
  return useSWR<FindCellTypeSpecificitiesResponse, unknown, CellTypeSpecificitiesKey>(key, (url) => fetcher({ url }));
}
