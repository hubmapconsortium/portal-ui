import useSWR from 'swr';
import {
  cellTypeNameContainsComma,
  createScFindKey,
  createScFindPostRequest,
  ScFindRequest,
  scFindFetcher,
  stringOrArrayToString,
  useScFindKey,
} from './utils';

export interface FindGeneSignaturesParams {
  cellTypes?: string | string[];
  minCells?: number;
  minFraction?: number;
}

type FindGeneSignaturesKey = ScFindRequest;

interface FindGeneSignaturesResponse {
  evaluateMarkers: unknown;
}

export function createFindGeneSignaturesKey(
  scFindEndpoint: string,
  { cellTypes, minCells, minFraction }: FindGeneSignaturesParams,
  scFindIndexVersion?: string,
): FindGeneSignaturesKey {
  if (cellTypeNameContainsComma(cellTypes)) {
    return createScFindPostRequest(
      scFindEndpoint,
      'findGeneSignatures',
      {
        cell_types: cellTypes ? (Array.isArray(cellTypes) ? cellTypes : [cellTypes]) : undefined,
        min_cells: minCells,
        min_fraction: minFraction,
      },
      scFindIndexVersion,
    );
  }
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
  return useSWR<FindGeneSignaturesResponse, unknown, FindGeneSignaturesKey>(key, scFindFetcher);
}
