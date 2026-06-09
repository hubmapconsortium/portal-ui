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

interface CellTypeMarkerInfo {
  cellType: string;
  f1: number;
  fn: number;
  fp: number;
  genes: string;
  precision: number;
  recall: number;
  tp: number;
}

export interface CellTypeMarkersParams {
  cellTypes: string | string[];
  backgroundCellTypes?: string[];
  topK?: number;
  sortField?: keyof CellTypeMarkerInfo;
  includePrefix?: boolean;
  modality?: string;
}

type CellTypeMarkersKey = ScFindRequest | null;

interface CellTypeMarkersResponse {
  // This is the correct name for the property based on the API response, even though it doesn't
  // match the naming convention of the endpoint
  findGeneSignatures: CellTypeMarkerInfo[];
}

export function createCellTypeMarkersKey({
  cellTypes,
  topK,
  backgroundCellTypes,
  sortField,
  includePrefix,
  modality,
}: CellTypeMarkersParams): CellTypeMarkersKey {
  if (!cellTypes || cellTypes.length === 0) {
    return null;
  }
  if (cellTypeNameContainsComma(cellTypes) || cellTypeNameContainsComma(backgroundCellTypes)) {
    return createScFindFlaskPostRequest('/scfind/cell-type-markers.json', {
      cell_types: toArray(cellTypes),
      background_cell_types: backgroundCellTypes,
      top_k: topK,
      include_prefix: includePrefix,
      sort_field: sortField,
    });
  }
  return createScFindFlaskKey('/scfind/cell-type-markers.json', {
    cell_types: stringOrArrayToString(cellTypes),
    background_cell_types: backgroundCellTypes ? stringOrArrayToString(backgroundCellTypes) : undefined,
    top_k: topK ? topK.toString() : undefined,
    include_prefix: includePrefix ? String(includePrefix) : undefined,
    sort_field: sortField,
    modality,
  });
}

export default function useCellTypeMarkers({
  topK = 10,
  sortField = 'f1',
  includePrefix = true,
  ...params
}: CellTypeMarkersParams) {
  const key = createCellTypeMarkersKey({ topK, sortField, includePrefix, ...params });
  return useSWR<CellTypeMarkersResponse, unknown, CellTypeMarkersKey>(key, scFindFetcher);
}
