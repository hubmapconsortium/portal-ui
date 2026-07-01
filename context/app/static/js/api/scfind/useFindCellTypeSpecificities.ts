import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindFlaskKey, stringOrArrayToString } from './utils';

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

export function createCellTypeSpecificitiesKey({
  geneList,
  datasets,
  minCells,
  minFraction,
}: FindCellTypeSpecificitiesParams): CellTypeSpecificitiesKey {
  return createScFindFlaskKey('/scfind/find-cell-type-specificities.json', {
    gene_list: geneList ? stringOrArrayToString(geneList) : undefined,
    datasets: datasets ? stringOrArrayToString(datasets) : undefined,
    min_cells: minCells ? String(minCells) : undefined,
    min_fraction: minFraction ? String(minFraction) : undefined,
  });
}

export default function useFindCellTypeSpecificities(params: FindCellTypeSpecificitiesParams) {
  const key = createCellTypeSpecificitiesKey(params);
  return useSWR<FindCellTypeSpecificitiesResponse, unknown, CellTypeSpecificitiesKey>(key, (url) => fetcher({ url }));
}
