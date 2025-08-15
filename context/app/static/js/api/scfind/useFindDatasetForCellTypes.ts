import useSWR from 'swr';
import { multiFetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { createScFindKey, stringOrArrayToString } from './utils';

export interface FindDatasetForCellTypeParams {
  cellType: string;
}

type FindDatasetForCellTypeKey = string | null;

export interface FindDatasetForCellTypeResponse {
  datasets: string[];
}

export function createFindDatasetForCellTypeKey(
  scFindEndpoint: string,
  { cellType }: FindDatasetForCellTypeParams,
  scFindIndexVersion?: string,
): FindDatasetForCellTypeKey {
  if (typeof cellType !== 'string' || cellType.length === 0) return null;
  return createScFindKey(
    scFindEndpoint,
    'findDatasetForCellType',
    {
      cell_type: cellType,
    },
    scFindIndexVersion,
  );
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
  const { scFindEndpoint, scFindIndexVersion } = useAppContext();
  const key = cellTypes.map((cellType) =>
    createFindDatasetForCellTypeKey(scFindEndpoint, { cellType }, scFindIndexVersion),
  );
  return useSWR<FindDatasetForCellTypeResponse[], unknown, FindDatasetForCellTypesKey>(
    key,
    (urls) =>
      multiFetcher({
        urls,
        errorMessages: {
          400: `No results found for ${stringOrArrayToString(cellTypes)}`,
        },
      }),
    {
      shouldRetryOnError: false,
    },
  );
}
