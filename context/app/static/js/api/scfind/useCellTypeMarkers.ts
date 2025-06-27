import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

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
): CellTypeMarkersKey {
  if (!cellTypes || cellTypes.length === 0) {
    return null;
  }
  return createScFindKey(scFindEndpoint, 'cellTypeMarkers', {
    cell_types: Array.isArray(cellTypes) ? cellTypes.join(',') : cellTypes,
    background_cell_types: Array.isArray(backgroundCellTypes) ? backgroundCellTypes.join(',') : backgroundCellTypes,
    top_k: topK ? topK.toString() : undefined,
    include_prefix: includePrefix ? String(includePrefix) : undefined,
    sort_field: sortField,
  });
}

export default function useCellTypeMarkers({
  topK = 10,
  sortField = 'f1',
  includePrefix = true,
  ...params
}: CellTypeMarkersParams) {
  const { scFindEndpoint } = useAppContext();
  const key = createCellTypeMarkersKey(scFindEndpoint, { topK, sortField, includePrefix, ...params });
  return useSWR<CellTypeMarkersResponse, unknown, CellTypeMarkersKey>(key, (url) => fetcher({ url }));
}
