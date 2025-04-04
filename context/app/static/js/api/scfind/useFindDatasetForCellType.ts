import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

export interface FindDatasetForCellTypeParams {
  cellType: string;
}

type EvaluateMarkersKey = string;

interface FindDatasetForCellTypeResponse {
  evaluateMarkers: unknown;
}

export function createFindDatasetForCellTypeKey(
  scFindEndpoint: string,
  { cellType }: FindDatasetForCellTypeParams,
): EvaluateMarkersKey {
  return createScFindKey(scFindEndpoint, 'findDatasetForCellType', {
    cell_type: cellType,
  });
}

export default function useFindDatasetForCellType(params: FindDatasetForCellTypeParams) {
  const { scFindEndpoint } = useAppContext();
  const key = createFindDatasetForCellTypeKey(scFindEndpoint, params);
  return useSWR<FindDatasetForCellTypeResponse, unknown, EvaluateMarkersKey>(key, (url) => fetcher({ url }));
}
