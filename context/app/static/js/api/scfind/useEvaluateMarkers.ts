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

export interface EvaluateMarkersParams {
  geneList: string | string[];
  cellTypes: string | string[];
  backgroundCellTypes?: string[];
  sortField?: string;
  includePrefix?: boolean;
}

type EvaluateMarkersKey = ScFindRequest;

interface EvaluateMarkersResponse {
  evaluateMarkers: unknown;
}

export function createCellTypeMarkersKey({
  geneList,
  cellTypes,
  backgroundCellTypes,
  sortField,
  includePrefix,
}: EvaluateMarkersParams): EvaluateMarkersKey {
  if (cellTypeNameContainsComma(cellTypes) || cellTypeNameContainsComma(backgroundCellTypes)) {
    return createScFindFlaskPostRequest('/scfind/evaluate-markers.json', {
      gene_list: toArray(geneList),
      cell_types: toArray(cellTypes),
      background_cell_types: backgroundCellTypes,
      sort_field: sortField,
      include_prefix: includePrefix,
    });
  }
  return createScFindFlaskKey('/scfind/evaluate-markers.json', {
    gene_list: stringOrArrayToString(geneList),
    cell_types: stringOrArrayToString(cellTypes),
    background_cell_types: backgroundCellTypes ? stringOrArrayToString(backgroundCellTypes) : undefined,
    sort_field: sortField,
    include_prefix: includePrefix !== undefined ? String(includePrefix) : undefined,
  });
}

export default function useEvaluateMarkers(params: EvaluateMarkersParams) {
  const key = createCellTypeMarkersKey(params);
  return useSWR<EvaluateMarkersResponse, unknown, EvaluateMarkersKey>(key, scFindFetcher);
}
