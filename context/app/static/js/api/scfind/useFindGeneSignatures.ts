import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, stringOrArrayToString, useScFindKey } from './utils';

export interface FindGeneSignaturesParams {
  cellTypes?: string | string[];
  minCells?: number;
  minFraction?: number;
}

type FindGeneSignaturesKey = string;

interface FindGeneSignaturesResponse {
  evaluateMarkers: unknown;
}

export function createFindGeneSignaturesKey(
  scFindEndpoint: string,
  { cellTypes, minCells, minFraction }: FindGeneSignaturesParams,
  scFindIndexVersion?: string,
): FindGeneSignaturesKey {
  return createScFindKey(
    scFindEndpoint,
    'findGeneSignatures',
    {
      cell_types: cellTypes ? stringOrArrayToString(cellTypes) : undefined,
      min_cells: minCells ? String(minCells) : undefined,
      min_fraction: minFraction ? String(minFraction) : undefined,
    },
    scFindIndexVersion,
  );
}

export default function useFindGeneSignatures(params: FindGeneSignaturesParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createFindGeneSignaturesKey(scFindEndpoint, params, scFindIndexVersion);
  return useSWR<FindGeneSignaturesResponse, unknown, FindGeneSignaturesKey>(key, (url) => fetcher({ url }));
}
