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

export function createCellTypeMarkersKey(
  scFindEndpoint: string,
  { geneList, cellTypes, backgroundCellTypes, sortField, includePrefix }: EvaluateMarkersParams,
  scFindIndexVersion?: string,
): EvaluateMarkersKey {
  if (cellTypeNameContainsComma(cellTypes) || cellTypeNameContainsComma(backgroundCellTypes)) {
    return createScFindPostRequest(
      scFindEndpoint,
      'evaluateMarkers',
      {
        gene_list: Array.isArray(geneList) ? geneList : [geneList],
        cell_types: Array.isArray(cellTypes) ? cellTypes : [cellTypes],
        background_cell_types: backgroundCellTypes,
        sort_field: sortField,
        include_prefix: includePrefix,
      },
      scFindIndexVersion,
    );
  }
  return createScFindKey(
    scFindEndpoint,
    'evaluateMarkers',
    {
      gene_list: stringOrArrayToString(geneList),
      cell_types: stringOrArrayToString(cellTypes),
      background_cell_types: backgroundCellTypes ? stringOrArrayToString(backgroundCellTypes) : undefined,
      sort_field: sortField,
      include_prefix: includePrefix !== undefined ? String(includePrefix) : undefined,
    },
    scFindIndexVersion,
  );
}

export default function useEvaluateMarkers(params: EvaluateMarkersParams) {
  const { scFindEndpoint, scFindIndexVersion } = useScFindKey();
  const key = createCellTypeMarkersKey(scFindEndpoint, params, scFindIndexVersion);
  return useSWR<EvaluateMarkersResponse, unknown, EvaluateMarkersKey>(key, scFindFetcher);
}
