import useSWR from 'swr';
import {
  cellTypeNameContainsComma,
  createScFindFlaskKey,
  createScFindFlaskPostRequest,
  ScFindRequest,
  scFindFetcher,
  stringOrArrayToString,
  toArray,
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

export function createFindGeneSignaturesKey({
  cellTypes,
  minCells,
  minFraction,
}: FindGeneSignaturesParams): FindGeneSignaturesKey {
  if (cellTypeNameContainsComma(cellTypes)) {
    return createScFindFlaskPostRequest('/scfind/find-gene-signatures.json', {
      cell_types: toArray(cellTypes),
      min_cells: minCells,
      min_fraction: minFraction,
    });
  }
  return createScFindFlaskKey('/scfind/find-gene-signatures.json', {
    cell_types: cellTypes ? stringOrArrayToString(cellTypes) : undefined,
    min_cells: minCells ? String(minCells) : undefined,
    min_fraction: minFraction ? String(minFraction) : undefined,
  });
}

export default function useFindGeneSignatures(params: FindGeneSignaturesParams) {
  const key = createFindGeneSignaturesKey(params);
  return useSWR<FindGeneSignaturesResponse, unknown, FindGeneSignaturesKey>(key, scFindFetcher);
}
