import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey, stringOrArrayToString } from './utils';

export interface EvaluateMarkersParams {
  geneList: string | string[];
  cellTypes: string | string[];
  backgroundCellTypes?: string[];
  sortField?: string;
  includePrefix?: boolean;
}

type EvaluateMarkersKey = string;

interface EvaluateMarkersResponse {
  evaluateMarkers: unknown;
}

export function createCellTypeMarkersKey(
  scFindEndpoint: string,
  { geneList, cellTypes, backgroundCellTypes, sortField, includePrefix }: EvaluateMarkersParams,
  scFindIndexVersion?: string,
): EvaluateMarkersKey {
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
  const { scFindEndpoint, scFindIndexVersion } = useAppContext();
  const key = createCellTypeMarkersKey(scFindEndpoint, params, scFindIndexVersion);
  return useSWR<EvaluateMarkersResponse, unknown, EvaluateMarkersKey>(key, (url) => fetcher({ url }));
}
