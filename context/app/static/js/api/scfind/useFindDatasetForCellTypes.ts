import useSWR from 'swr';
import { multiFetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey } from './utils';

export interface FindDatasetForCellTypeParams {
  cellType: string;
}

type FindDatasetForCellTypeKey = string;

interface FindDatasetForCellTypeResponse {
  datasets: string[];
}

export function createFindDatasetForCellTypeKey(
  scFindEndpoint: string,
  { cellType }: FindDatasetForCellTypeParams,
): FindDatasetForCellTypeKey {
  return createScFindKey(scFindEndpoint, 'findDatasetForCellType', {
    cell_type: cellType,
  });
}

export interface FindDatasetForCellTypesParams {
  cellTypes: string[];
}

type FindDatasetForCellTypesKey = FindDatasetForCellTypeKey[];

/**
 * Returns lists of datasets that contain the given cell types, matching the index of the original passed cell types.
 * @param params.cellTypes The cell types to search for.
 * @returns A list of HBM dataset IDs that contain the given cell types.
 */
export default function useFindDatasetForCellTypes({ cellTypes }: FindDatasetForCellTypesParams) {
  const { scFindEndpoint } = useAppContext();
  const key = cellTypes.map((cellType) => createFindDatasetForCellTypeKey(scFindEndpoint, { cellType }));
  return useSWR<FindDatasetForCellTypeResponse[], unknown, FindDatasetForCellTypesKey>(key, (urls) =>
    multiFetcher({ urls }),
  );
}
