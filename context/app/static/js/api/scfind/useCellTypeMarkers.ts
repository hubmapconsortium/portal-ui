import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { createScFindKey, stringOrArrayToString, useScFindKey } from './utils';

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
}

type CellTypeMarkersKey = string | null;

interface CellTypeMarkersResponse {
  // This is the correct name for the property based on the API response, even though it doesn't
  // match the naming convention of the endpoint
  findGeneSignatures: CellTypeMarkerInfo[];
}

export function createCellTypeMarkersKey(
  scFindEndpoint: string,
  { cellTypes, topK, backgroundCellTypes, sortField, includePrefix }: CellTypeMarkersParams,
  scFindIndexVersion?: string,
): CellTypeMarkersKey {
  if (!cellTypes || cellTypes.length === 0) {
    return null;
  }
  return createScFindKey(
    scFindEndpoint,
    'cellTypeMarkers',
    {
      cell_types: stringOrArrayToString(cellTypes),
      background_cell_types: backgroundCellTypes ? stringOrArrayToString(backgroundCellTypes) : undefined,
      top_k: topK ? topK.toString() : undefined,
      include_prefix: includePrefix ? String(includePrefix) : undefined,
      sort_field: sortField,
    },
    scFindIndexVersion,
  );
}

export default function useCellTypeMarkers({
  topK = 10,
  sortField = 'f1',
  includePrefix = true,
  ...params
}: CellTypeMarkersParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createCellTypeMarkersKey(
    scFindEndpoint,
    { topK, sortField, includePrefix, ...params },
    scFindIndexVersion,
  );
  return useSWR<CellTypeMarkersResponse, unknown, CellTypeMarkersKey>(key, (url) => fetcher({ url }));
}
